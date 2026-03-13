let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
const users = JSON.parse(localStorage.getItem("users")) || [];
const role = localStorage.getItem("role");

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

if (role !== "admin") {
  window.location = "index.html";
}

const userSelect = document.getElementById("userSelect");
const taskInput = document.getElementById("taskInput");
const prioritySelect = document.getElementById("priority");
const assignTaskBtn = document.getElementById("assignTaskBtn");
const taskList = document.getElementById("taskList");
const refreshBtn = document.getElementById("refreshBtn");

const filterAllBtn = document.getElementById("filterAll");
const filterPendingBtn = document.getElementById("filterPending");
const filterCompletedBtn = document.getElementById("filterCompleted");

let currentFilter = "all";

function populateUsers() {
  const users = JSON.parse(localStorage.getItem("users")) || [];
  userSelect.innerHTML = "";

  const allOption = document.createElement("option");
  allOption.value = "all";
  allOption.textContent = "All Users";
  userSelect.appendChild(allOption);

  const placeholder = document.createElement("option");
  placeholder.value = "";
  placeholder.textContent = users.length ? "Select user to assign" : "No users available";
  placeholder.disabled = true;
  placeholder.selected = true;
  userSelect.appendChild(placeholder);

  users.forEach((user) => {
    const option = document.createElement("option");
    option.value = user.email;
    option.textContent = `${user.name} ${user.lastname || ''} (${user.email})`;
    userSelect.appendChild(option);
  });
}

function refreshTasks() {
  tasks = JSON.parse(localStorage.getItem("tasks")) || [];
  ensureTaskIds();
  populateUsers();
  displayTasks(currentFilter);
}

function setActiveFilter(filter) {
  currentFilter = filter;
  filterAllBtn.classList.toggle("active", filter === "all");
  filterPendingBtn.classList.toggle("active", filter === "pending");
  filterCompletedBtn.classList.toggle("active", filter === "completed");
}

function displayTasks(filter = "all") {
  setActiveFilter(filter);

  const filtered = tasks.filter((task) => {
    if (filter === "pending") return !task.completed;
    if (filter === "completed") return task.completed;
    return true;
  });

  taskList.innerHTML = "";

  filtered.forEach((task) => {
    const li = document.createElement("li");
    li.className = `priority-${task.priority.toLowerCase()} ${
      task.completed ? "task-completed" : ""
    }`;

    const owner = users.find((u) => u.email === task.user);
    const ownerText = owner ? `${owner.name} ${owner.lastname || ''}` : task.user;

    const text = document.createElement("span");
    text.textContent = `${task.text} (${task.priority}) — ${ownerText}`;

    const actions = document.createElement("div");
    actions.style.display = "flex";
    actions.style.gap = "8px";

    if (!task.completed) {
      const completeBtn = document.createElement("button");
      completeBtn.textContent = "Complete";
      completeBtn.onclick = () => completeTask(task.id);
      completeBtn.className = "task-btn";
      actions.appendChild(completeBtn);
    }

    const deleteBtn = document.createElement("button");
    deleteBtn.textContent = "Delete";
    deleteBtn.onclick = () => deleteTask(task.id);
    deleteBtn.className = "task-btn delete-btn";
    actions.appendChild(deleteBtn);

    li.appendChild(text);
    li.appendChild(actions);
    taskList.appendChild(li);
  });
}

function assignTask() {
  const assignedTo = userSelect.value;
  const text = taskInput.value.trim();
  const priority = prioritySelect.value;

  if (!assignedTo) {
    alert("Select a user to assign the task.");
    return;
  }

  if (!text) {
    alert("Enter a task description.");
    taskInput.focus();
    return;
  }

  const users = JSON.parse(localStorage.getItem("users")) || [];

  if (assignedTo === "all") {
    users.forEach((user) => {
      const id = `${Date.now()}-${Math.random().toString(16).slice(2)}`;
      tasks.push({
        id,
        text,
        priority,
        completed: false,
        user: user.email,
      });
    });
  } else {
    const id = `${Date.now()}-${Math.random().toString(16).slice(2)}`;
    tasks.push({
      id,
      text,
      priority,
      completed: false,
      user: assignedTo,
    });
  }

  localStorage.setItem("tasks", JSON.stringify(tasks));
  taskInput.value = "";
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

function logout() {
  localStorage.removeItem("role");
  window.location = "index.html";
}

assignTaskBtn.addEventListener("click", assignTask);
refreshBtn.addEventListener("click", () => window.location.reload());
filterAllBtn.addEventListener("click", () => displayTasks("all"));
filterPendingBtn.addEventListener("click", () => displayTasks("pending"));
filterCompletedBtn.addEventListener("click", () => displayTasks("completed"));

populateUsers();
refreshTasks();
