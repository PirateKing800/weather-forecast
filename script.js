(() => {
    const taskListEl = document.querySelector('#task-list');
    const tasksUrl = './attachments/tasks.json';

    const totalTasksEl = document.getElementById('total-tasks');
    const completedTasksEl = document.getElementById('completed-tasks');
    const pendingTasksEl = document.getElementById('pending-tasks');

    const statusFilterEl = document.getElementById('status-filter');
    const searchBoxEl = document.getElementById('search-box');

    // Load tasks from localStorage or fetch
    let tasks = JSON.parse(localStorage.getItem('tasks')) || [];

    function saveTasks() {
        localStorage.setItem('tasks', JSON.stringify(tasks));
    }

    function createTaskItem(task) {
        const li = document.createElement('li');
        li.dataset.title = task.title.toLowerCase();
        li.dataset.status = task.status;

        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.checked = task.status === 'completed';
        checkbox.addEventListener('change', () => {
            task.status = checkbox.checked ? 'completed' : 'pending';
            li.dataset.status = task.status;
            saveTasks();
            updateCounters();
            applyFilters();
        });

        const span = document.createElement('span');
        span.textContent = task.title;

        li.appendChild(checkbox);
        li.appendChild(span);
        return li;
    }

    function renderTasks() {
        taskListEl.innerHTML = '';
        tasks.forEach(task => {
            const li = createTaskItem(task);
            taskListEl.appendChild(li);
        });
        updateCounters();
        applyFilters();
    }

    function updateCounters() {
        const total = tasks.length;
        const completed = tasks.filter(t => t.status === 'completed').length;
        const pending = total - completed;
        if (totalTasksEl) totalTasksEl.textContent = total;
        if (completedTasksEl) completedTasksEl.textContent = completed;
        if (pendingTasksEl) pendingTasksEl.textContent = pending;
    }

    function applyFilters() {
        const filterStatus = statusFilterEl.value; // 'all', 'pending', 'completed'
        const searchText = searchBoxEl.value.toLowerCase();

        Array.from(taskListEl.children).forEach(li => {
            const matchesStatus = filterStatus === 'all' || li.dataset.status === filterStatus;
            const matchesSearch = li.dataset.title.includes(searchText);
            li.style.display = matchesStatus && matchesSearch ? '' : 'none';
        });
    }

    // Initialize tasks
    if (tasks.length === 0) {
        fetch(tasksUrl)
            .then(res => res.json())
            .then(fetchedTasks => {
                tasks = fetchedTasks;
                saveTasks();
                renderTasks();
            })
            .catch(() => {
                tasks = [];
                saveTasks();
                renderTasks();
            });
    } else {
        renderTasks();
    }

    // Event handlers for filters
    if (statusFilterEl) {
        statusFilterEl.addEventListener('change', applyFilters);
    }
    if (searchBoxEl) {
        searchBoxEl.addEventListener('input', applyFilters);
    }
})();