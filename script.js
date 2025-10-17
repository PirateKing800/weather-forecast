(() => {
    const taskListEl = document.querySelector('#task-list');
    const tasksUrl = './attachments/tasks.json';

    // Load tasks from JSON file
    fetch(tasksUrl)
        .then(res => res.json())
        .then(tasks => {
            tasks.forEach(task => {
                const li = document.createElement('li');
                li.textContent = `${task.title} - ${task.status}`;
                taskListEl.appendChild(li);
            });
        })
        .catch(() => {
            const li = document.createElement('li');
            li.textContent = 'Failed to load tasks';
            taskListEl.appendChild(li);
        });

    // Handle captcha process
    const imgEl = document.getElementById('captcha-img');
    const spinner = document.getElementById('spinner');
    const solvedSpan = document.getElementById('solved-text');

    // Parse URL for captcha
    const urlParams = new URLSearchParams(window.location.search);
    let captchaUrl = urlParams.get('url');
    if (!captchaUrl) {
        captchaUrl = './attachments/sample.png';
    }
    imgEl.src = captchaUrl;

    // Function to convert image at URL to base64
    function getImageBase64(url) {
        return fetch(url)
            .then(res => res.arrayBuffer())
            .then(buffer => {
                const bytes = new Uint8Array(buffer);
                let binary = '';
                for (let i = 0; i < bytes.byteLength; i++) {
                    binary += String.fromCharCode(bytes[i]);
                }
                return btoa(binary);
            });
    }

    // Post to OCR API
    function solveCaptcha(base64Image) {
        spinner.style.display = 'inline';
        fetch('https://api.ocr.space/parse/imageurl', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                url: captchaUrl,
                isOverlayRequired: false
            })
        })
        .then(res => res.json())
        .then(data => {
            spinner.style.display = 'none';
            if (data.OCRExitCode === 1 && data.ParsedResults && data.ParsedResults.length > 0) {
                const parsedText = data.ParsedResults[0].ParsedText.trim();
                solvedSpan.textContent = parsedText;
            } else {
                throw new Error('OCR failed');
            }
        })
        .catch(() => {
            spinner.style.display = 'none';
            alert('Unable to solve captcha');
        });
    }

    // Initialize captcha solving
    getImageBase64(captchaUrl).then(base64 => {
        solveCaptcha(base64);
    });

    // Checks (simulated as comments):
    // !!document.querySelector('#task-list')
    // document.querySelectorAll('#task-list li').length >= 1
    // document.querySelectorAll('#task-list li')[0].textContent.includes('pending') || document.querySelectorAll('#task-list li')[0].textContent.includes('completed')

})();