const taskInput = document.querySelector("#task");
const taskForm = document.querySelector("#task-form");
const filterInput = document.querySelector("#filter");
const clearTask = document.querySelector(".clear-task");
const tasksCollection = document.querySelector(".collection");


loadEventListeners();

// Event Listeners
function loadEventListeners() {
    document.addEventListener("DOMContentLoaded", displayTasks);
    taskForm.addEventListener("submit", createTask);
    tasksCollection.addEventListener("click", removeTask);
    filterInput.addEventListener("keyup", filterTasks);
}


// Create new Task
function createTask(e) {
  if (taskInput.value !== "") {
    const newTask = checkIfTaskExists(capitalizeTask(taskInput.value));

    if (newTask === "Task already exist") {
      showError("msg-error", newTask);
    } else {
      showTask(newTask);
      addTaskToLocalStorage(newTask);
      showError("msg-success", "Task added successfully");
    }
  } else {
    showError("msg-error", "Please enter a task");
  }

  taskInput.value = "";
  e.preventDefault();
}

// Delete Task
function removeTask(e) {
  let task = e.target.parentElement.parentElement;
  if (e.target.parentElement.classList.contains("delete-item")) {
    if (confirm("Are you sure")) {
      removeTaskFromLocalStorage(task.textContent);
        task.remove();
        showError("msg-success", "Task deleted successfully");
    }
  }
}

// Display New Task on Dom
function showTask(task) {
  const tasksCollection = document.querySelector(".collection");
  const newTask = document.createElement("li");
  newTask.className = "collection-item";
  newTask.appendChild(document.createTextNode(task));
  const link = document.createElement("a");
  link.className = "delete-item secondary-content";
  link.innerHTML = "<i class='fa fa-remove'></i>";
  newTask.appendChild(link);
  tasksCollection.appendChild(newTask);
}

// DOMCONTENTLOADED => Display tasks from Ls On the Dom
function displayTasks() {
  const tasks = getTaskFromLocalStorage();
  tasks.forEach((task) => {
    showTask(task);
  });
}

// get task from local storage
function getTaskFromLocalStorage() {
  let tasks;
  if (localStorage.getItem("tasks") === null) {
    tasks = [];
  } else {
    tasks = JSON.parse(localStorage.getItem("tasks"));
  }
  return tasks;
}

// Add task to localStorage
function addTaskToLocalStorage(newTask) {
  let tasks = getTaskFromLocalStorage();
  tasks.push(newTask);
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

// Delete Task from LocalStorage
function removeTaskFromLocalStorage(task) {
  const tasks = getTaskFromLocalStorage();
  tasks.forEach((lsTask, i) => {
    if (lsTask === task) {
      tasks.splice(i, 1);
    }
  });
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

// Check if task already exists in Local storage
function checkIfTaskExists(newTask) {
  const tasks = getTaskFromLocalStorage();
  if (tasks.includes(newTask)) {
    return "Task already exist";
  } else {
    return newTask;
  }
}

// Filter Task
function filterTasks(e) {
    const tasks = Array.from(tasksCollection.querySelectorAll('.collection-item'));
    const words = e.target.value.toLowerCase();
    tasks.forEach((task) => {
        if (task.firstChild.data.toLowerCase().indexOf(words) > -1) {
            task.style.display = '';
        } else {
            task.style.display = 'none';
        }
    });
}

// Capitalize text input
function capitalizeTask(words) {
  return words.slice(0, 1).toUpperCase() + words.slice(1).toLowerCase();
}

// Display error
function showError(className, msg) {
  const container = document.querySelector(".card");
  const cardAction = document.querySelector(".card-action");
  const p = document.createElement("p");
  p.classList = `msg ${className}`;
  p.appendChild(document.createTextNode(msg));
  container.insertBefore(p, cardAction);
  setTimeout(function () {
    p.remove();
  }, 2000);
}

