// --- STATE MANAGEMENT ---
let tasks = [
    {
        id: 1,
        title: "Research content ideas",
        description: "Look for trends in AI and Web Development.",
        list: "Work",
        date: "2026-03-22",
        completed: false,
        subtasks: ["Check Twitter", "Check Reddit"]
    },
    {
        id: 2,
        title: "Renew driver's license",
        description: "Go to DMV website.",
        list: "Personal",
        date: "2026-03-22",
        completed: false,
        subtasks: []
    }
];

let currentFilter = 'today'; 
let currentTaskId = null;

// --- DOM ELEMENTS ---
const taskListContainer = document.getElementById('taskListContainer');
const newTaskInput = document.getElementById('newTaskInput');
const detailPanel = document.getElementById('detailPanel');
const pageTitle = document.getElementById('pageTitle');
const totalCount = document.getElementById('totalCount');
const menuToggle = document.getElementById('menuToggle');
const sidebar = document.querySelector('.sidebar');

// Detail Panel Inputs
const editId = document.getElementById('editId');
const editTitle = document.getElementById('editTitle');
const editDesc = document.getElementById('editDesc');
const editList = document.getElementById('editList');
const editDate = document.getElementById('editDate');
const subtaskList = document.getElementById('subtaskList');

// --- INITIALIZATION ---
document.addEventListener('DOMContentLoaded', () => {
    renderTasks();
    updateSidebarCounts();
    setupSidebarNavigation();
});

// --- SIDEBAR TOGGLE ---
menuToggle.addEventListener('click', () => {
    sidebar.classList.toggle('hide-sidebar');
});

// --- RENDER FUNCTION ---
function renderTasks() {
    taskListContainer.innerHTML = '';
    
    // Filter tasks
    const filteredTasks = tasks.filter(task => {
        if (currentFilter === 'today') return true; 
        if (currentFilter === 'upcoming') return new Date(task.date) > new Date();
        return task.list === currentFilter;
    });

    // Update Header
    pageTitle.innerHTML = `${capitalize(currentFilter)} <span class="count-box">${filteredTasks.length}</span>`;

    // Create Elements
    filteredTasks.forEach(task => {
        const item = document.createElement('div');
        item.className = `task-item ${currentTaskId === task.id ? 'active' : ''}`;
        
        // Clicking body opens panel
        item.onclick = (e) => {
            if(e.target.type !== 'checkbox') openDetailPanel(task.id);
        };

        const tagColor = getTagColor(task.list);

        item.innerHTML = `
            <input type="checkbox" class="task-check" ${task.completed ? 'checked' : ''} onclick="toggleComplete(${task.id})">
            <div class="task-details">
                <span class="task-title" style="${task.completed ? 'text-decoration: line-through; color: #ccc;' : ''}">${task.title}</span>
                <div class="task-meta">
                    <span><i class="far fa-calendar"></i> ${task.date}</span>
                    <span class="subtask-count">${task.subtasks.length} Subtasks</span>
                    <span class="tag ${tagColor}">${task.list}</span>
                </div>
            </div>
            <i class="fas fa-chevron-right"></i>
        `;
        taskListContainer.appendChild(item);
    });
}

// --- ADD NEW TASK ---
newTaskInput.addEventListener('keypress', function (e) {
    if (e.key === 'Enter' && this.value.trim() !== '') {
        const newTask = {
            id: Date.now(),
            title: this.value,
            description: "",
            list: "Personal",
            date: new Date().toISOString().split('T')[0],
            completed: false,
            subtasks: []
        };
        tasks.unshift(newTask);
        this.value = '';
        renderTasks();
        updateSidebarCounts();
    }
});

// --- DETAIL PANEL FUNCTIONS ---
function openDetailPanel(id) {
    const task = tasks.find(t => t.id === id);
    if (!task) return;

    currentTaskId = id;
    renderTasks(); // To update active state

    // Fill inputs
    editId.value = task.id;
    editTitle.value = task.title;
    editDesc.value = task.description;
    editList.value = task.list;
    editDate.value = task.date;
    renderSubtasks(task.subtasks);

    detailPanel.style.display = 'flex';
}

function closePanel() {
    detailPanel.style.display = 'none';
    currentTaskId = null;
    renderTasks();
}

function saveTaskDetails() {
    const id = parseInt(editId.value);
    const task = tasks.find(t => t.id === id);
    
    if (task) {
        task.title = editTitle.value;
        task.description = editDesc.value;
        task.list = editList.value;
        task.date = editDate.value;
        
        renderTasks();
        updateSidebarCounts();
        alert("Changes Saved!");
    }
}

function deleteCurrentTask() {
    if(confirm("Delete this task?")) {
        tasks = tasks.filter(t => t.id !== currentTaskId);
        closePanel();
        renderTasks();
        updateSidebarCounts();
    }
}

// --- SUBTASKS ---
function renderSubtasks(subtasks) {
    subtaskList.innerHTML = '';
    subtasks.forEach(sub => {
        const div = document.createElement('div');
        div.className = 'subtask-row';
        div.innerHTML = `<input type="checkbox"> <span>${sub}</span>`;
        subtaskList.appendChild(div);
    });
}

function addSubtask() {
    const input = document.getElementById('newSubtaskInput');
    const task = tasks.find(t => t.id === currentTaskId);
    
    if(task && input.value.trim() !== '') {
        task.subtasks.push(input.value);
        renderSubtasks(task.subtasks);
        renderTasks(); // Update count on main list
        input.value = '';
    }
}

// --- UTILITIES ---
function toggleComplete(id) {
    const task = tasks.find(t => t.id === id);
    if(task) {
        task.completed = !task.completed;
        renderTasks();
    }
}

function setupSidebarNavigation() {
    const navItems = document.querySelectorAll('.nav-item');
    navItems.forEach(item => {
        item.addEventListener('click', () => {
            navItems.forEach(nav => nav.classList.remove('active'));
            item.classList.add('active');
            currentFilter = item.getAttribute('data-filter');
            closePanel();
            renderTasks();
        });
    });
}

function updateSidebarCounts() {
    const count = (filter) => {
        if(filter === 'today') return tasks.length;
        if(filter === 'upcoming') return tasks.filter(t => new Date(t.date) > new Date()).length;
        return tasks.filter(t => t.list === filter).length;
    };
    document.getElementById('count-today').innerText = count('today');
    document.getElementById('count-upcoming').innerText = count('upcoming');
    document.getElementById('count-personal').innerText = count('Personal');
    document.getElementById('count-work').innerText = count('Work');
    document.getElementById('count-list1').innerText = count('List 1');
}

function getTagColor(list) {
    if (list === 'Personal') return 'red';
    if (list === 'Work') return 'blue';
    return 'yellow';
}

function capitalize(str) { return str.charAt(0).toUpperCase() + str.slice(1); }