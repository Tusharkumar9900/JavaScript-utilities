// DOM Elements
const taskInput = document.getElementById('task-input');
const addTaskBtn = document.getElementById('add-task');
const tasksList = document.getElementById('tasks-list');
const themeToggle = document.getElementById('theme-toggle');
const totalTasksSpan = document.getElementById('total-tasks');
const completedTasksSpan = document.getElementById('completed-tasks');

// State
let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
let isDarkTheme = localStorage.getItem('darkTheme') === 'true';

// Initialize theme
document.documentElement.setAttribute('data-theme', isDarkTheme ? 'dark' : 'light');
themeToggle.querySelector('i').className = isDarkTheme ? 'fas fa-sun' : 'fas fa-moon';

// Event Listeners
addTaskBtn.addEventListener('click', addTask);
taskInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') addTask();
});
themeToggle.addEventListener('click', toggleTheme);

// Functions
function addTask() {
    const taskText = taskInput.value.trim();
    if (!taskText) return;

    const task = {
        id: Date.now(),
        text: taskText,
        completed: false,
        createdAt: new Date().toISOString()
    };

    tasks.push(task);
    saveTasks();
    renderTasks();
    updateStats();
    taskInput.value = '';

    // Add animation to the newly added task
    const newTaskElement = document.querySelector(`.task-item[data-id="${task.id}"]`);
    if (newTaskElement) {
        newTaskElement.classList.add('adding');
        setTimeout(() => {
            newTaskElement.classList.remove('adding');
        }, 500);
    }
}

function toggleTask(id) {
    const taskElement = document.querySelector(`.task-item[data-id="${id}"]`);
    if (!taskElement) return;

    const task = tasks.find(t => t.id === id);
    if (task) {
        // Add completing class to trigger animation
        taskElement.classList.add('completing');
        
        // Wait for animation to complete before updating the task
        setTimeout(() => {
            task.completed = !task.completed;
            saveTasks();
            renderTasks();
            updateStats();
        }, 500);
    }
}

function deleteTask(id) {
    const taskElement = document.querySelector(`.task-item[data-id="${id}"]`);
    if (!taskElement) return;

    // Add deleting class to trigger animation
    taskElement.classList.add('deleting');

    // Wait for animation to complete before removing the task
    setTimeout(() => {
        tasks = tasks.filter(task => task.id !== id);
        saveTasks();
        renderTasks();
        updateStats();
    }, 500); // Match this with the animation duration in CSS
}

function toggleTheme() {
    isDarkTheme = !isDarkTheme;
    document.documentElement.setAttribute('data-theme', isDarkTheme ? 'dark' : 'light');
    themeToggle.querySelector('i').className = isDarkTheme ? 'fas fa-sun' : 'fas fa-moon';
    localStorage.setItem('darkTheme', isDarkTheme);
}

function saveTasks() {
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

function updateStats() {
    totalTasksSpan.textContent = tasks.length;
    completedTasksSpan.textContent = tasks.filter(task => task.completed).length;
}

function renderTasks() {
    tasksList.innerHTML = tasks
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        .map(task => `
            <li class="task-item ${task.completed ? 'completed' : ''}" data-id="${task.id}">
                <input type="checkbox" 
                       class="task-checkbox" 
                       ${task.completed ? 'checked' : ''}
                       onchange="toggleTask(${task.id})">
                <span class="task-text">${task.text}</span>
                <button class="delete-task" onclick="deleteTask(${task.id})" aria-label="Delete task">
                    <i class="fas fa-trash"></i>
                </button>
            </li>
        `).join('');
}

// Initial render
renderTasks();
updateStats(); 