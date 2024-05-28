const taskForm = $('#task-form'); // Variables for DOM traversal
const taskTitleInput = $('#task-title');
const taskDueDateInput = $('#task-due-date');
const taskDescriptionInput = $('#task-description');
const taskTable = $('#task-display');
let taskEntries = []; // Initializes the working array

// Retrieve tasks and nextId from localStorage
//let taskList = JSON.parse(localStorage.getItem("tasks"));
//let nextId = JSON.parse(localStorage.getItem("nextId")); WTF is this for?

function getTasksFromStorage() { // Checks for a stored array of objects in local storage and if so retrieves it and sets it to the working array
    const storedTaskEntries = JSON.parse(localStorage.getItem('tasks'));
    if (storedTaskEntries !== null) {
        taskEntries = storedTaskEntries;
    }
    return taskEntries;
};

function saveTasksToStorage(input) { // Stringifies the task list array of objects and saves to local storage
    localStorage.setItem('tasks', JSON.stringify(input));
}

function generateTaskId(taskTitleBase) { // Generating a task id based on parsing the title into an int then multiplying by a random int
    const genTaskId = (parseInt(taskTitleBase, 36) * Math.floor(Math.random() * (100 - 1)));
    return (genTaskId.toString()); // Changing the int to a string and returning the value
}

function createTaskCard(task) { // Creating the task card, the various elements, classes, attributes and ids
    const taskCard = $('<section>').addClass('card task-card draggable my-3').attr('data-project-id', task.id);
    const taskCardHeader = $('<header>').addClass('card-header h3').text(task.title);
    const taskCardBody = $('<body>').addClass('card-body');
    const taskCardDueDate = $('<p>').addClass('card-text').text(task.dueDate).attr('data-project-id', task.id);
    const taskCardDescription = $('<p>').addClass('card-text').text(task.description);
    const taskCardDeleteButton = $('<button>').addClass('btn btn-danger btn-delete-project').text('Delete').attr('data-project-id', task.id);

    if (task.dueDate && task.status !== 'done') { // Checking the due date, if due today or past due coloring the task cards appropriately
        const today = dayjs();
        const checkDueDate = dayjs(task.dueDate, 'DD/MM/YYYY');

        if (today.isSame(checkDueDate, 'day')) { // Compares the current date to the due date of the task card, adds class coloring if needed
            taskCard.addClass('bg-warning text-white');
            taskCardBody.addClass('bg-warning text-white');
        } else if (today.isAfter(checkDueDate)) {
            taskCard.addClass('bg-danger text-white');
            taskCardBody.addClass('bg-danger text-white');
            taskCardDeleteButton.addClass('border-white');
        }
    }

    taskCardBody.append(taskCardDescription, taskCardDueDate, taskCardDeleteButton); // Appending description, due date and delete button to the card body
    taskCard.append(taskCardHeader, taskCardBody); // Appending the header and body to the task card
    return taskCard; // Returns the completed task card
}


// Todo: create a function to render the task list and make cards draggable
function renderTaskList() { // Renders the tasks list cards to the appropriate containers and adds the draggable jQueryUI widget
    const todoCardList = $('#todo-cards'); // Finding the divs that contain the task cards and emptying them in preperation for displaying
    todoCardList.empty();
    const inProgressCardList = $('#in-progress-cards');
    inProgressCardList.empty();
    const doneCardList = $('#done-cards');
    doneCardList.empty();
    const storedTasks = getTasksFromStorage(); // 

    storedTasks.forEach((tasks) => { // Loops through the array and appends the task cards to the appropriate containers
        if (tasks.status === 'to-do') {
            todoCardList.append(createTaskCard(tasks));
        } else if (tasks.status === 'in-progress') {
            inProgressCardList.append(createTaskCard(tasks));
        } else {
            doneCardList.append(createTaskCard(tasks));
        }
    });

    $(function () { // Draggable widget from jQueryUI
        $('.draggable').draggable({
            zIndex: 100, opacity: 0.8, // Sets the helper clone to have a zIndex of always on top and the opacity
            helper: function (event) { // This fixes the issue with the draggable helper clone not being the same size as the original card
                let originalCard;
                if ($(event.target).hasClass("draggable") === $(event.target)) { // Checks if the draggable item is the direct target
                    originalCard = $(event.target); // Makes a copy of the direct target
                } else {
                    originalCard = $(event.target).closest(".draggable"); // Makes a copy of the closest parent that matches the draggable class
                };
                return originalCard.clone().css({ width: originalCard.outerWidth() }); // Returns a clone of the original card to be used by the draggable widget
            }
        });
    });
};

function handleAddTask(event) { // Adding a task from a form input, processing into an object and putting it in localStorage
    event.preventDefault(); // Stops the page from refreshing on submit
    if (!taskTitleInput.val() || !taskDueDateInput.val() || !taskDescriptionInput.val()) { // Checks for empty fields on form submit
        alert("Please fill in all fields before continuing.");
        return;
    } else {
        const taskEntry = { // Creates the object from the form input, trimming string inputs
            title: taskTitleInput.val().trim(),
            dueDate: taskDueDateInput.val(),
            description: taskDescriptionInput.val().trim(),
            status: 'to-do', // Default status on creation. States are to-do, in-progress, done
            id: generateTaskId(taskTitleInput.val()), // Calls generateTaskId to create a unique numeric id for each entry
        };

        taskEntries.push(taskEntry); // Pushes the task entry to the task list array
        saveTasksToStorage(taskEntries); // Calls the function that stringifies and saves the task list into local storage
    };

    taskTitleInput.val(''); // Clearing the form inputs
    taskDueDateInput.val('');
    taskDescriptionInput.val('');
    renderTaskList(); // Refreshing the containers to show the task cards in the correct containers
};

function handleDeleteTask(event) { // Deletes an object from the task list array
    const storedTasks = getTasksFromStorage();
    const currentTaskId = $(this).attr('data-project-id');
    console.log(currentTaskId);

    storedTasks.forEach((tasks) => { // Finds the index of the current TRY AND REPLACE THIS WITH A filter()!!!
        if (tasks.id === currentTaskId) {
            storedTasks.splice(storedTasks.indexOf(tasks), 1);
        }
    });

    saveTasksToStorage(storedTasks); // Calls the function that stringifies and saves the task list into local storage
    renderTaskList(); // Refreshing the containers to show the task cards in the correct containers
}

function handleDrop(event, ui) { // Changes the status key of an object when a task card is dropped onto a new container
    const storedTasks = getTasksFromStorage(); // Getting the task list from localStorage
    const containerStatus = event.target.id; // Finding the element id of the drop target
    const currentTaskId = ui.draggable[0].dataset.projectId; // Finding the unique id for the droppable

    for (let tasks of storedTasks) { // Finds the id of the dropped item in the task list array then changes the status key of the matching object
        if (tasks.id === currentTaskId) {
            tasks.status = containerStatus;
        }
    };
    saveTasksToStorage(storedTasks); // Calls the function that stringifies and saves the task list into local storage
    renderTaskList(); // Refreshing the containers to show the task cards in the correct containers
}

// Event listeners for add task and delete button, datepicker for form, making containers in lanes droppable, retrieves tasks list from local storage, renders the task list onto the page
$(document).ready(function () {

    taskForm.on('submit', handleAddTask); // Listens for a submit even from the taskForm then calls handleAddTask to parse the input

    taskTable.on('click', '.btn-delete-project', handleDeleteTask); // Listens for a click on the delete button

    $('#task-due-date').datepicker({ // Datepicker jQuery widget for date input on the form
        changeMonth: true, changeYear: true
    });

    $('.lane').droppable({ // Droppable widget from jQueryUI, sets the element in the page that cards can be dropped onto
        accept: '.draggable', drop: handleDrop
    });

    getTasksFromStorage(); // Checks localStorage for stored tasks and if it finds them loads them into the working array
    renderTaskList(); // Renders the task list to the lanes

});