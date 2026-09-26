
/*   
   Select Elements
   */

const taskForm = document.getElementById("taskForm");

const taskInput = document.getElementById("taskInput");

const pendingTasks = document.getElementById("pendingTasks");

const completedTasks = document.getElementById("completedTasks");

const pendingCount = document.getElementById("pendingCount");

const completedCount = document.getElementById("completedCount");

const errorMessage = document.getElementById("errorMessage");


/*   
   Load Tasks
   */

let tasks = JSON.parse(localStorage.getItem("todoTasks")) || [];


/*   
   Save Tasks
   */

function saveTasks() {

    localStorage.setItem(
        "todoTasks",
        JSON.stringify(tasks)
    );

}


/*   
   Add New Task
   */

taskForm.addEventListener("submit", function (event) {

    event.preventDefault();

    const taskText = taskInput.value.trim();


    // Empty task validation
    if (taskText === "") {

        errorMessage.textContent =
            "Please enter a task.";

        taskInput.focus();

        return;
    }


    // Clear error
    errorMessage.textContent = "";


    // Create task object
    const newTask = {

        id: Date.now(),

        text: taskText,

        completed: false,

        createdAt: new Date().toLocaleString()

    };


    // Add task
    tasks.push(newTask);


    // Save to localStorage
    saveTasks();


    // Clear input
    taskInput.value = "";


    // Display tasks
    renderTasks();

});


/*   
   Render Tasks
   */

function renderTasks() {

    // Clear current lists
    pendingTasks.innerHTML = "";

    completedTasks.innerHTML = "";


    // Separate tasks
    const pending = tasks.filter(
        task => !task.completed
    );

    const completed = tasks.filter(
        task => task.completed
    );


    // Update counts
    pendingCount.textContent = pending.length;

    completedCount.textContent = completed.length;


    /* ===============================
       Pending Tasks
    =============================== */

    if (pending.length === 0) {

        pendingTasks.innerHTML = `
            <div class="empty-state">

                <div class="empty-icon">✓</div>

                <h3>No pending tasks</h3>

                <p>
                    Add a task to get started.
                </p>

            </div>
        `;

    } else {

        pending.forEach(task => {

            pendingTasks.appendChild(
                createTaskElement(task)
            );

        });

    }


    /* ===============================
       Completed Tasks
    =============================== */

    if (completed.length === 0) {

        completedTasks.innerHTML = `
            <div class="empty-state">

                <div class="empty-icon">✓</div>

                <h3>No completed tasks</h3>

                <p>
                    Completed tasks will appear here.
                </p>

            </div>
        `;

    } else {

        completed.forEach(task => {

            completedTasks.appendChild(
                createTaskElement(task)
            );

        });

    }

}


/*   
   Create Task Element
   */

function createTaskElement(task) {

    const taskItem = document.createElement("div");

    taskItem.className = "task-item";


    if (task.completed) {

        taskItem.classList.add("completed-task");

    }


    const taskInfo = document.createElement("div");

    taskInfo.className = "task-info";


    const taskText = document.createElement("span");

    taskText.className = "task-text";

    taskText.textContent = task.text;


    const taskTime = document.createElement("small");

    taskTime.className = "task-time";

    taskTime.textContent =
        "Added: " + task.createdAt;


    taskInfo.appendChild(taskText);

    taskInfo.appendChild(taskTime);


    /* ===============================
       Buttons
    =============================== */

    const taskActions = document.createElement("div");

    taskActions.className = "task-actions";


    // Complete / Undo button
    const completeButton =
        document.createElement("button");

    completeButton.className = "complete-btn";

    completeButton.textContent =
        task.completed ? "Undo" : "Complete";


    completeButton.addEventListener(
        "click",
        function () {

            toggleTask(task.id);

        }
    );


    // Edit button
    const editButton =
        document.createElement("button");

    editButton.className = "edit-btn";

    editButton.textContent = "Edit";


    editButton.addEventListener(
        "click",
        function () {

            editTask(task.id);

        }
    );


    // Delete button
    const deleteButton =
        document.createElement("button");

    deleteButton.className = "delete-btn";

    deleteButton.textContent = "Delete";


    deleteButton.addEventListener(
        "click",
        function () {

            deleteTask(task.id);

        }
    );


    // Add buttons
    taskActions.appendChild(completeButton);

    taskActions.appendChild(editButton);

    taskActions.appendChild(deleteButton);


    // Add content
    taskItem.appendChild(taskInfo);

    taskItem.appendChild(taskActions);


    return taskItem;

}


/*   
   Complete / Undo Task
   */

function toggleTask(id) {

    tasks = tasks.map(function (task) {

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

}


/*   
   Edit Task
   */

function editTask(id) {

    const task = tasks.find(
        task => task.id === id
    );


    if (!task) {
        return;
    }


    const newText = prompt(
        "Edit your task:",
        task.text
    );


    if (newText === null) {
        return;
    }


    const updatedText = newText.trim();


    if (updatedText === "") {

        alert("Task cannot be empty.");

        return;
    }


    task.text = updatedText;


    saveTasks();

    renderTasks();

}


/*   
   Delete Task
   */

function deleteTask(id) {

    const confirmDelete =
        confirm("Are you sure you want to delete this task?");


    if (!confirmDelete) {
        return;
    }


    tasks = tasks.filter(
        task => task.id !== id
    );


    saveTasks();

    renderTasks();

}


/*   
   Initial Display
   */

renderTasks();

