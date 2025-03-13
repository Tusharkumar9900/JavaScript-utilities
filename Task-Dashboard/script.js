// DOM Elements
const taskInput = document.getElementById('task-input');
const addTaskBtn = document.getElementById('add-task');
const tasksList = document.getElementById('tasks-list');
const themeToggle = document.getElementById('theme-toggle');
const totalTasksSpan = document.getElementById('total-tasks');
const completedTasksSpan = document.getElementById('completed-tasks');
const taskDetails = document.getElementById('task-details');
const closeDetailsBtn = document.getElementById('close-details');
const subtaskInput = document.getElementById('subtask-input');
const addSubtaskBtn = document.getElementById('add-subtask');
const subtasksList = document.getElementById('subtasks-list');
const noteInput = document.getElementById('note-input');
const addNoteBtn = document.getElementById('add-note');
const notesList = document.getElementById('notes-list');

// State
let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
let isDarkTheme = localStorage.getItem('darkTheme') === 'true';
let selectedTaskId = null;

// Initialize theme
document.documentElement.setAttribute('data-theme', isDarkTheme ? 'dark' : 'light');
themeToggle.querySelector('i').className = isDarkTheme ? 'fas fa-sun' : 'fas fa-moon';

// Event Listeners
addTaskBtn.addEventListener('click', addTask);
taskInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') addTask();
});
themeToggle.addEventListener('click', toggleTheme);
closeDetailsBtn.addEventListener('click', closeTaskDetails);
addSubtaskBtn.addEventListener('click', addSubtask);
subtaskInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') addSubtask();
});
addNoteBtn.addEventListener('click', addNote);

// Functions
function addTask() {
    const taskText = taskInput.value.trim();
    if (!taskText) return;

    const task = {
        id: Date.now(),
        text: taskText,
        completed: false,
        createdAt: new Date().toISOString(),
        subtasks: [],
        notes: []
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

function showTaskDetails(id) {
    const task = tasks.find(t => t.id === id);
    if (!task) return;

    selectedTaskId = id;
    taskDetails.classList.add('active');
    
    // Update task details header
    document.getElementById('task-details-title').textContent = task.text;
    
    // Render subtasks
    renderSubtasks(task);
    
    // Render notes
    renderNotes(task);
}

function closeTaskDetails() {
    taskDetails.classList.remove('active');
    selectedTaskId = null;
}

function addSubtask() {
    if (!selectedTaskId) return;
    
    const subtaskText = subtaskInput.value.trim();
    if (!subtaskText) return;

    const task = tasks.find(t => t.id === selectedTaskId);
    if (task) {
        const subtask = {
            id: Date.now(),
            text: subtaskText,
            completed: false
        };
        
        task.subtasks.push(subtask);
        saveTasks();
        renderSubtasks(task);
        subtaskInput.value = '';

        // Add animation to the newly added subtask
        const newSubtaskElement = document.querySelector(`.subtask-item[data-id="${subtask.id}"]`);
        if (newSubtaskElement) {
            newSubtaskElement.classList.add('adding');
            setTimeout(() => {
                newSubtaskElement.classList.remove('adding');
            }, 500);
        }
    }
}

function toggleSubtask(subtaskId) {
    if (!selectedTaskId) return;
    
    const task = tasks.find(t => t.id === selectedTaskId);
    if (!task) return;

    const subtask = task.subtasks.find(st => st.id === subtaskId);
    if (subtask) {
        subtask.completed = !subtask.completed;
        saveTasks();
        renderSubtasks(task);
    }
}

function deleteSubtask(subtaskId) {
    if (!selectedTaskId) return;
    
    const task = tasks.find(t => t.id === selectedTaskId);
    if (!task) return;

    task.subtasks = task.subtasks.filter(st => st.id !== subtaskId);
    saveTasks();
    renderSubtasks(task);
}

function addNote() {
    if (!selectedTaskId) return;
    
    const noteText = noteInput.value.trim();
    if (!noteText) return;

    const task = tasks.find(t => t.id === selectedTaskId);
    if (task) {
        const note = {
            id: Date.now(),
            text: noteText,
            createdAt: new Date().toISOString()
        };
        
        task.notes.push(note);
        saveTasks();
        renderNotes(task);
        noteInput.value = '';
    }
}

function deleteNote(noteId) {
    if (!selectedTaskId) return;
    
    const task = tasks.find(t => t.id === selectedTaskId);
    if (!task) return;

    task.notes = task.notes.filter(n => n.id !== noteId);
    saveTasks();
    renderNotes(task);
}

function renderSubtasks(task) {
    if (!task.subtasks) {
        task.subtasks = [];
    }
    
    subtasksList.innerHTML = task.subtasks.map((subtask, index) => `
        <li class="subtask-item ${subtask.completed ? 'completed' : ''}" data-id="${subtask.id}">
            <div class="subtask-content">
                <div class="subtask-number">${index + 1}</div>
                <div class="subtask-text-container">
                    <input type="checkbox" 
                           class="subtask-checkbox" 
                           ${subtask.completed ? 'checked' : ''}
                           onchange="toggleSubtask(${subtask.id})">
                    <span class="subtask-text">${subtask.text}</span>
                </div>
                <div class="subtask-actions">
                    <button class="edit-subtask" onclick="editSubtask(${subtask.id})" aria-label="Edit subtask">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="delete-subtask" onclick="deleteSubtask(${subtask.id})" aria-label="Delete subtask">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </div>
        </li>
    `).join('');
}

function editSubtask(subtaskId) {
    if (!selectedTaskId) return;
    
    const task = tasks.find(t => t.id === selectedTaskId);
    if (!task) return;

    const subtask = task.subtasks.find(st => st.id === subtaskId);
    if (!subtask) return;

    const subtaskElement = document.querySelector(`.subtask-item[data-id="${subtaskId}"]`);
    const subtaskText = subtaskElement.querySelector('.subtask-text');
    const currentText = subtask.text;

    // Create edit input
    const editInput = document.createElement('input');
    editInput.type = 'text';
    editInput.value = currentText;
    editInput.className = 'subtask-edit-input';
    
    // Replace text with input
    subtaskText.replaceWith(editInput);
    editInput.focus();

    // Handle save on enter or blur
    function saveEdit() {
        const newText = editInput.value.trim();
        if (newText && newText !== currentText) {
            subtask.text = newText;
            saveTasks();
            renderSubtasks(task);
        } else {
            renderSubtasks(task);
        }
    }

    editInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            saveEdit();
        }
    });

    editInput.addEventListener('blur', saveEdit);
}

function renderNotes(task) {
    notesList.innerHTML = task.notes.map(note => `
        <li class="note-item" data-id="${note.id}">
            <p class="note-text">${note.text}</p>
            <small class="note-date">${new Date(note.createdAt).toLocaleString()}</small>
            <button class="delete-note" onclick="deleteNote(${note.id})" aria-label="Delete note">
                <i class="fas fa-trash"></i>
            </button>
        </li>
    `).join('');
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
                <div class="task-actions">
                    <button class="view-details-btn" onclick="showTaskDetails(${task.id})" aria-label="View task details">
                        <i class="fas fa-info-circle"></i>
                    </button>
                    <button class="delete-task" onclick="deleteTask(${task.id})" aria-label="Delete task">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </li>
        `).join('');
}

// Initial render
renderTasks();
updateStats(); 