// Simple To-Do app (localStorage)
const STORAGE_KEY = 'todo_tasks_v1';
const taskForm = document.getElementById('task-form');
const taskInput = document.getElementById('task-input');
const taskList = document.getElementById('task-list');
const clearCompletedBtn = document.getElementById('clear-completed');
const clearAllBtn = document.getElementById('clear-all');

let tasks = [];

// helper: save to localStorage
function save() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
}

// helper: load from localStorage
function load() {
  const raw = localStorage.getItem(STORAGE_KEY);
  tasks = raw ? JSON.parse(raw) : [];
}

// render tasks to the page
function render() {
  taskList.innerHTML = '';
  if (tasks.length === 0) {
    taskList.innerHTML = '<li style="color:#777">No tasks yet — add one above.</li>';
    return;
  }

  tasks.forEach(task => {
    const li = document.createElement('li');
    li.className = 'task' + (task.complete ? ' completed' : '');
    // left side
    const left = document.createElement('div');
    left.className = 'left';
    const cb = document.createElement('input');
    cb.type = 'checkbox';
    cb.checked = !!task.complete;
    cb.addEventListener('change', () => toggleComplete(task.id));

    const span = document.createElement('span');
    span.className = 'text';
    span.textContent = task.text;

    left.appendChild(cb);
    left.appendChild(span);

    // right side
    const right = document.createElement('div');
    const delBtn = document.createElement('button');
    delBtn.className = 'btn';
    delBtn.textContent = 'Delete';
    delBtn.addEventListener('click', () => deleteTask(task.id));

    right.appendChild(delBtn);

    li.appendChild(left);
    li.appendChild(right);
    taskList.appendChild(li);
  });
}

// add a task
function addTask(text) {
  const t = { id: Date.now(), text: text.trim(), complete: false };
  if (!t.text) return;
  tasks.unshift(t); // newest first
  save();
  render();
}

// toggle complete
function toggleComplete(id) {
  tasks = tasks.map(t => t.id === id ? { ...t, complete: !t.complete } : t);
  save();
  render();
}

// delete
function deleteTask(id) {
  tasks = tasks.filter(t => t.id !== id);
  save();
  render();
}

// clear completed
function clearCompleted() {
  tasks = tasks.filter(t => !t.complete);
  save();
  render();
}

// clear all
function clearAll() {
  if (!confirm('Clear all tasks?')) return;
  tasks = [];
  save();
  render();
}

// handlers
taskForm.addEventListener('submit', e => {
  e.preventDefault();
  addTask(taskInput.value);
  taskInput.value = '';
  taskInput.focus();
});

clearCompletedBtn.addEventListener('click', clearCompleted);
clearAllBtn.addEventListener('click', clearAll);

// init
load();
render();
