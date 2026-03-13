let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

const user = JSON.parse(localStorage.getItem("currentUser"));

function ensureTaskIds() {
  let updated = false;
  tasks = tasks.map((t) => {
    if (!t.id) {
      updated = true;
      return {
        ...t,
        id: `${Date.now()}-${Math.random().toString(16).slice(2)}`,
      };
    }
    return t;
  });

  if (updated) {
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }
}

if (!user) {
  window.location = "index.html";
}

const taskList = document.getElementById("taskList");
const profileName = document.getElementById("profileName");
const newTaskText = document.getElementById("newTaskText");
const newTaskPriority = document.getElementById("newTaskPriority");
const addTaskBtn = document.getElementById("addTaskBtn");
const refreshBtn = document.getElementById("refreshBtn");

let currentFilter = "all";

profileName.textContent = user.name + ' ' + (user.lastname || '');

function refreshTasks() {
  tasks = JSON.parse(localStorage.getItem("tasks")) || [];
  ensureTaskIds();
  displayTasks(currentFilter);
}

function getUserTasks() {
  return tasks.filter((t) => t.user === user.email);
}

function setActiveFilter(filter) {
  currentFilter = filter;
  document.querySelectorAll(".menu button").forEach((el) => {
    const label = el.textContent.trim().toLowerCase();
    const target = filter === "all" ? "home" : filter;
    el.classList.toggle("active", label === target);
  });
}

function displayTasks(filter = "all") {
  setActiveFilter(filter);

  const userTasks = getUserTasks();
  const filtered = userTasks.filter((t) => {
    if (filter === "pending") return !t.completed;
    if (filter === "completed") return t.completed;
    return true;
  });

  taskList.innerHTML = "";

  filtered.forEach((task) => {
    const li = document.createElement("li");
    li.className = `priority-${task.priority.toLowerCase()} ${
      task.completed ? "task-completed" : ""
    }`;

    const text = document.createElement("span");
    text.textContent = `${task.text} (${task.priority})`;

    const actions = document.createElement("div");
    actions.style.display = "flex";
    actions.style.gap = "8px";

    if (!task.completed) {
      const completeBtn = document.createElement("button");
      completeBtn.textContent = "Complete";
      completeBtn.onclick = () => completeTask(task.id);
      completeBtn.className = "task-btn";
      actions.appendChild(completeBtn);
    } else {
      const deleteBtn = document.createElement("button");
      deleteBtn.textContent = "Delete";
      deleteBtn.onclick = () => deleteTask(task.id);
      deleteBtn.className = "task-btn delete-btn";
      actions.appendChild(deleteBtn);
    }

    li.appendChild(text);
    li.appendChild(actions);
    taskList.appendChild(li);
  });
}

function addTask() {
  const text = newTaskText.value.trim();
  if (!text) {
    alert("Please enter a task.");
    newTaskText.focus();
    return;
  }

  const priority = newTaskPriority.value;
  const id = `${Date.now()}-${Math.random().toString(16).slice(2)}`;

  tasks.push({
    id,
    text,
    priority,
    completed: false,
    user: user.email,
  });

  localStorage.setItem("tasks", JSON.stringify(tasks));
  newTaskText.value = "";
  displayTasks(currentFilter);
}

function completeTask(taskId) {
  const index = tasks.findIndex((t) => t.id === taskId);
  if (index === -1) return;

  tasks[index].completed = true;
  localStorage.setItem("tasks", JSON.stringify(tasks));
  displayTasks(currentFilter);
}

function deleteTask(taskId) {
  const index = tasks.findIndex((t) => t.id === taskId);
  if (index === -1) return;

  tasks.splice(index, 1);
  localStorage.setItem("tasks", JSON.stringify(tasks));
  displayTasks(currentFilter);
}

function showAll() {
  displayTasks("all");
}

function showPending() {
  displayTasks("pending");
}

function showCompleted() {
  displayTasks("completed");
}

function logout() {
  localStorage.removeItem("currentUser");
  window.location = "index.html";
}

addTaskBtn.addEventListener("click", addTask);
refreshBtn.addEventListener("click", refreshTasks);

// Real-time updates every 5 seconds
setInterval(refreshTasks, 5000);

displayTasks();
