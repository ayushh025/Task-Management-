const form = document.querySelector("#form");
const title = document.querySelector("#title");
const description = document.querySelector("#description");
const date = document.querySelector("#date");
const priority = document.querySelector("#priority");
const message = document.querySelector("#message");

const taskList = document.querySelector(".task-list");
const filterTask = document.querySelector("#filter-task");
let editIdx = -1;
// load tasks from localStorage
const tasks = JSON.parse(localStorage.getItem("tasks")) || [];

form.addEventListener("submit", (evt) => {
  evt.preventDefault();
  addTask();
});

// Function to add/ update task
function addTask() {
  message.innerHTML = ""; // clear previous errors

  // Initially set all field valid
  let isValid = true;

  // Validation
  if (title.value.trim() === "") {
    const titleErr = document.createElement("p");
    titleErr.textContent = "Please enter task title";
    message.append(titleErr);
    isValid = false;
  }

  if (description.value.trim() === "") {
    const descErr = document.createElement("p");
    descErr.textContent = "Please enter task description";
    message.append(descErr);
    isValid = false;
  }
  if (date.value.trim() === "") {
    const dateErr = document.createElement("p");
    dateErr.textContent = "Please enter due date";
    message.append(dateErr);
    isValid = false;
  }
  if (priority.value === "priority") {
    const priErr = document.createElement("p");
    priErr.textContent = "Please select priority";
    message.append(priErr);
    isValid = false;
  }

  // date validation (avoid past date)
  const selectedDate = new Date(date.value);
  selectedDate.setHours(0, 0, 0, 0);

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  if (selectedDate < today) {
    const dtErr = document.createElement("p");
    dtErr.textContent = "Date cannot be in the past";
    message.append(dtErr);
    isValid = false;
  }

  if (isValid) {
    if (editIdx === -1) {
      // Add new task
      tasks.push({
        title: title.value,
        description: description.value,
        date: date.value,
        priority: priority.value,
      });
    } else {
      // Update task
      tasks[editIdx] = {
        title: title.value,
        description: description.value,
        date: date.value,
        priority: priority.value,
      };
      editIdx = -1; // reset edit index to -1

      // reset button
      document.querySelector("#submit-btn").textContent = "Add Task";
    }

    // save to localStorage
    localStorage.setItem("tasks", JSON.stringify(tasks));
    displayTasks(tasks); // re-render UI
    form.reset(); // clear form
  }
}
function displayTasks(tasksArr) {
  taskList.innerHTML = ""; // clear list
  tasksArr.forEach((val, idx) => {
    const task = document.createElement("div");
    task.classList.add("task");

    const taskTitle = document.createElement("p");
    taskTitle.textContent = val.title;
    taskTitle.classList.add("task-title");

    const desc = document.createElement("p");
    desc.textContent = val.description;

    const dt = document.createElement("p");
    dt.textContent = `Due date: ${val.date}`;

    const pry = document.createElement("p");
    pry.textContent = `Priority: ${val.priority}`;
    pry.classList.add(
      val.priority === "high"
        ? "high"
        : val.priority === "low"
          ? "low"
          : "medium",
    );

    const actions = document.createElement("div");
    actions.classList.add("actions");

    const edit = document.createElement("button");
    edit.textContent = "Edit";
    edit.addEventListener("click", () => {
      title.value = val.title;
      description.value = val.description;
      date.value = val.date;
      priority.value = val.priority;
      editIdx = idx;
      document.querySelector("#submit-btn").textContent = "Update Task";
    });

    const deleteBtn = document.createElement("button");
    deleteBtn.textContent = "Delete";

    deleteBtn.addEventListener("click", () => {
      tasks.splice(idx, 1);
      localStorage.setItem("tasks", JSON.stringify(tasks)); // update storage
      displayTasks(tasks);
    });

    actions.append(edit, deleteBtn);
    task.append(taskTitle, desc, dt, pry, actions);

    taskList.append(task);
  });
}

filterTask.addEventListener("input", () => {
  if (tasks.length === 0) return;
  if (filterTask.value === "all") {
    displayTasks(tasks);
    return;
  }
  if (filterTask.value === "low") {
    const filteredTasks = tasks.filter((val) => {
      return val.priority === "low";
    });
    displayTasks(filteredTasks);
    return;
  }
  if (filterTask.value === "medium") {
    const filteredTasks = tasks.filter((val) => {
      return val.priority === "medium";
    });
    displayTasks(filteredTasks);
    return;
  }
  if (filterTask.value === "high") {
    const filteredTasks = tasks.filter((val) => {
      return val.priority === "high";
    });
    displayTasks(filteredTasks);
    return;
  }
});

// initial render
displayTasks(tasks);
