const taskInput = document.getElementById('taskInput');
const addBtn = document.getElementById('addBtn');
const todoList = document.getElementById('todoList');
const totalTasksEl = document.getElementById('totalTasks');
const completedTasksEl = document.getElementById('completedTasks');

// Load tasks from localStorage
let tasks = JSON.parse(localStorage.getItem('tasks')) || [];

// Render all tasks
function renderTasks() {
  todoList.innerHTML = '';

  if (tasks.length === 0) {
    todoList.innerHTML = `
      <div class="empty-state">
        <p>🎯 No tasks yet</p>
        <p>Add a new task to get started!</p>
      </div>`;
    updateStats();
    return;
  }

  tasks.forEach((task, index) => {
    const item = document.createElement('div');
    item.className = `todo-item ${task.completed ? 'completed' : ''}`;

    item.innerHTML = `
      <input type="checkbox" ${task.completed ? 'checked' : ''} />
      <span class="todo-text">${task.text}</span>
      <button class="delete-btn">×</button>
    `;

    // Checkbox toggle
    const checkbox = item.querySelector('input[type="checkbox"]');
    checkbox.addEventListener('change', () => {
      tasks[index].completed = checkbox.checked;
      saveTasks();
      renderTasks();
    });

    // Delete button
    const deleteBtn = item.querySelector('.delete-btn');
    deleteBtn.addEventListener('click', () => {
      tasks.splice(index, 1);
      saveTasks();
      renderTasks();
    });

    todoList.appendChild(item);
  });

  updateStats();
}

// Save tasks to localStorage
function saveTasks() {
  localStorage.setItem('tasks', JSON.stringify(tasks));
}

// Update statistics
function updateStats() {
  const total = tasks.length;
  const completed = tasks.filter(task => task.completed).length;

  totalTasksEl.textContent = `${total} task${total !== 1 ? 's' : ''}`;
  completedTasksEl.textContent = `${completed} completed`;
}

// Add new task
function addTask() {
  const text = taskInput.value.trim();

  if (text === '') return;

  tasks.unshift({
    text: text,
    completed: false,
    date: new Date().toISOString()
  });

  saveTasks();
  renderTasks();
  taskInput.value = '';
  taskInput.focus();
}

// Event Listeners
addBtn.addEventListener('click', addTask);

taskInput.addEventListener('keypress', (e) => {
  if (e.key === 'Enter') {
    addTask();
  }
});

// Bonus: Ctrl + Delete to clear all completed tasks
document.addEventListener('keydown', (e) => {
  if (e.key === 'Delete' && e.ctrlKey) {
    if (confirm('Clear all completed tasks?')) {
      tasks = tasks.filter(task => !task.completed);
      saveTasks();
      renderTasks();
    }
  }
});

// Initial render
renderTasks();
