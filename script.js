// ==========================================
// TASK DATA
// ==========================================

let tasks = JSON.parse(
    localStorage.getItem("tasks")
) || [];

let currentFilter = "all";


// ==========================================
// ELEMENTS
// ==========================================

const taskInput =
    document.getElementById("taskInput");

const priorityInput =
    document.getElementById("priorityInput");

const dateInput =
    document.getElementById("dateInput");

const addTaskButton =
    document.getElementById("addTaskButton");

const taskList =
    document.getElementById("taskList");

const emptyState =
    document.getElementById("emptyState");

const searchInput =
    document.getElementById("searchInput");

const totalTasks =
    document.getElementById("totalTasks");

const activeTasks =
    document.getElementById("activeTasks");

const completedTasks =
    document.getElementById("completedTasks");

const themeButton =
    document.getElementById("themeButton");

const clearCompleted =
    document.getElementById("clearCompleted");


// ==========================================
// SAVE TASKS
// ==========================================

function saveTasks() {

    localStorage.setItem(
        "tasks",
        JSON.stringify(tasks)
    );

}


// ==========================================
// ADD TASK
// ==========================================

function addTask() {

    const title =
        taskInput.value.trim();

    if (title === "") {

        alert("Please enter a task.");

        return;
    }


    const task = {

        id: Date.now(),

        title: title,

        priority:
            priorityInput.value,

        date:
            dateInput.value,

        completed: false

    };


    tasks.push(task);

    saveTasks();

    renderTasks();

    updateStats();


    taskInput.value = "";

    dateInput.value = "";

    priorityInput.value = "medium";

    taskInput.focus();

}


// ==========================================
// TOGGLE TASK
// ==========================================

function toggleTask(id) {

    tasks = tasks.map(task => {

        if (task.id === id) {

            return {
                ...task,
                completed: !task.completed
            };

        }

        return task;

    });


    saveTasks();

    renderTasks();

    updateStats();

}


// ==========================================
// DELETE TASK
// ==========================================

function deleteTask(id) {

    tasks =
        tasks.filter(
            task => task.id !== id
        );


    saveTasks();

    renderTasks();

    updateStats();

}


// ==========================================
// EDIT TASK
// ==========================================

function editTask(id) {

    const task =
        tasks.find(
            task => task.id === id
        );


    if (!task) {
        return;
    }


    const newTitle =
        prompt(
            "Edit your task:",
            task.title
        );


    if (
        newTitle !== null &&
        newTitle.trim() !== ""
    ) {

        task.title =
            newTitle.trim();

        saveTasks();

        renderTasks();

    }

}


// ==========================================
// FORMAT DATE
// ==========================================

function formatDate(date) {

    if (!date) {
        return "No due date";
    }


    const parts =
        date.split("-");


    return `${parts[2]}/${parts[1]}/${parts[0]}`;

}


// ==========================================
// GET PRIORITY LABEL
// ==========================================

function getPriorityLabel(priority) {

    if (priority === "high") {
        return "🔴 High";
    }

    if (priority === "medium") {
        return "🟡 Medium";
    }

    return "🟢 Low";

}


// ==========================================
// FILTER TASKS
// ==========================================

function getFilteredTasks() {

    let filtered =
        [...tasks];


    // Filter

    if (currentFilter === "active") {

        filtered =
            filtered.filter(
                task => !task.completed
            );

    }


    if (currentFilter === "completed") {

        filtered =
            filtered.filter(
                task => task.completed
            );

    }


    // Search

    const search =
        searchInput.value
            .toLowerCase()
            .trim();


    if (search !== "") {

        filtered =
            filtered.filter(
                task =>
                    task.title
                        .toLowerCase()
                        .includes(search)
            );

    }


    return filtered;

}


// ==========================================
// RENDER TASKS
// ==========================================

function renderTasks() {

    const filteredTasks =
        getFilteredTasks();


    taskList.innerHTML = "";


    if (filteredTasks.length === 0) {

        emptyState.style.display =
            "block";

        return;

    }


    emptyState.style.display =
        "none";


    filteredTasks.forEach(task => {

        const taskElement =
            document.createElement("div");


        taskElement.className =
            "task";


        if (task.completed) {

            taskElement.classList.add(
                "completed"
            );

        }


        taskElement.innerHTML = `

            <div
                class="checkbox"
                onclick="toggleTask(${task.id})"
            >
                ${
                    task.completed
                    ? "✓"
                    : ""
                }
            </div>


            <div class="task-info">

                <div class="task-title">
                    ${escapeHTML(task.title)}
                </div>


                <div class="task-meta">

                    <span
                        class="priority ${task.priority}"
                    >
                        ${getPriorityLabel(
                            task.priority
                        )}
                    </span>


                    <span>
                        📅 ${
                            formatDate(
                                task.date
                            )
                        }
                    </span>

                </div>

            </div>


            <div class="task-actions">

                <button
                    onclick="editTask(${task.id})"
                    title="Edit"
                >
                    ✏️
                </button>


                <button
                    class="delete-btn"
                    onclick="deleteTask(${task.id})"
                    title="Delete"
                >
                    🗑️
                </button>

            </div>

        `;


        taskList.appendChild(
            taskElement
        );

    });

}


// ==========================================
// UPDATE STATISTICS
// ==========================================

function updateStats() {

    const total =
        tasks.length;


    const completed =
        tasks.filter(
            task => task.completed
        ).length;


    const active =
        total - completed;


    totalTasks.textContent =
        total;

    activeTasks.textContent =
        active;

    completedTasks.textContent =
        completed;

}


// ==========================================
// FILTER BUTTONS
// ==========================================

document
    .querySelectorAll(".filter-btn")
    .forEach(button => {

        button.addEventListener(
            "click",
            () => {

                document
                    .querySelectorAll(
                        ".filter-btn"
                    )
                    .forEach(btn => {

                        btn.classList.remove(
                            "active"
                        );

                    });


                button.classList.add(
                    "active"
                );


                currentFilter =
                    button.dataset.filter;


                renderTasks();

            }
        );

    });


// ==========================================
// SEARCH
// ==========================================

searchInput.addEventListener(
    "input",
    renderTasks
);


// ==========================================
// ADD BUTTON
// ==========================================

addTaskButton.addEventListener(
    "click",
    addTask
);


// ==========================================
// ENTER KEY
// ==========================================

taskInput.addEventListener(
    "keydown",
    event => {

        if (event.key === "Enter") {

            addTask();

        }

    }
);


// ==========================================
// CLEAR COMPLETED
// ==========================================

clearCompleted.addEventListener(
    "click",
    () => {

        tasks =
            tasks.filter(
                task => !task.completed
            );


        saveTasks();

        renderTasks();

        updateStats();

    }
);


// ==========================================
// DARK MODE
// ==========================================

function toggleTheme() {

    document.body.classList.toggle(
        "dark"
    );


    const darkMode =
        document.body.classList.contains(
            "dark"
        );


    localStorage.setItem(
        "darkMode",
        darkMode
    );


    themeButton.textContent =
        darkMode
        ? "☀️"
        : "🌙";

}


themeButton.addEventListener(
    "click",
    toggleTheme
);


// ==========================================
// LOAD DARK MODE
// ==========================================

const savedDarkMode =
    localStorage.getItem(
        "darkMode"
    );


if (savedDarkMode === "true") {

    document.body.classList.add(
        "dark"
    );

    themeButton.textContent =
        "☀️";

}


// ==========================================
// SECURITY HELPER
// ==========================================

function escapeHTML(text) {

    const div =
        document.createElement("div");

    div.textContent = text;

    return div.innerHTML;

}


// ==========================================
// INITIAL LOAD
// ==========================================

renderTasks();

updateStats();