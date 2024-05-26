const taskForm = $('#task-form'); // Variables for DOM traversal
const taskTitleInput = $('#task-title');
const taskDueDateInput = $('#task-due-date');
const taskDescriptionInput = $('#task-description');
const taskTable = $('#task-display');
let taskEntries = []; // Initializes the working array

function getTasksFromStorage() { // Checks for a stored array of objects in local storage and if so retrieves it and sets it to the working array
    const storedTaskEntries = JSON.parse(localStorage.getItem('tasks'));
    if (storedTaskEntries !== null) {
      taskEntries = storedTaskEntries;
    }
    return taskEntries;
};

function saveTasksToStorage(input){
    localStorage.setItem('tasks', JSON.stringify(input)); // Stringifies the task list array of objects and saves to local storage
}

// Retrieve tasks and nextId from localStorage
//let taskList = JSON.parse(localStorage.getItem("tasks"));
//let nextId = JSON.parse(localStorage.getItem("nextId"));

// Todo: create a function to generate a unique task id
function generateTaskId(taskTitleBase) { // Generating a task id based on parsing the title into an int then multiplying by a random int
    const genTaskId = (parseInt(taskTitleBase, 36) * Math.floor(Math.random() * (100 - 1)));
    return (genTaskId.toString());
}

// Todo: create a function to create a task card
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

        if (today.isSame(checkDueDate, 'day')) {
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
function renderTaskList() {
    const todoCardList = $('#todo-cards'); // Finding the divs that contain the task cards and emptying them in preperation for displaying
    todoCardList.empty();
    const inProgressCardList = $('#in-progress-cards');
    inProgressCardList.empty();
    const doneCardList = $('#done-cards');
    doneCardList.empty();
    const storedTasks = getTasksFromStorage(); // 

    storedTasks.forEach((tasks) => {
        if (tasks.status === 'to-do'){
            todoCardList.append(createTaskCard(tasks));
        } else if (tasks.status === 'in-progress'){
            inProgressCardList.append(createTaskCard(tasks));
        } else { 
            doneCardList.append(createTaskCard(tasks));
        }
    });
    
    $( function() { // Draggable widget from jQueryUI
        $('.draggable').draggable({stack: '.draggable', opacity: 0.5});
    });
};

// Todo: create a function to handle adding a new task
function handleAddTask(event){ // Adding a task from a form input, processing into an object and putting it in localStorage
    event.preventDefault(); // Stops the page from refreshing on submit
    if (!taskTitleInput.val() || !taskDueDateInput.val() || !taskDescriptionInput.val()){ // Checks for empty fields on form submit
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

// Todo: create a function to handle deleting a task
function handleDeleteTask(event){
    const storedTasks = getTasksFromStorage();
    const currentTaskId = $(this).attr('data-project-id');
    console.log(currentTaskId);

    storedTasks.forEach((tasks) => { // Finds the index of the current
        if (tasks.id === currentTaskId) {
            storedTasks.splice(storedTasks.indexOf(tasks), 1);
      }
    });

    saveTasksToStorage(storedTasks); // Calls the function that stringifies and saves the task list into local storage
    renderTaskList(); // Refreshing the containers to show the task cards in the correct containers
}

// Todo: create a function to handle dropping a task into a new status lane
function handleDrop(event, ui) {
    const storedTasks = getTasksFromStorage(); // Getting the task list from localStorage
    const containerStatus = event.target.id; // Finding the element id of the drop target
    const currentTaskId = ui.draggable[0].dataset.projectId; // Finding the unique id for the droppable
    
    for (let tasks of storedTasks) { // ? Find the project card by the `id` and update the project status.
         if (tasks.id === currentTaskId) {
          tasks.status = containerStatus;
        }
    };
    saveTasksToStorage(storedTasks); // Calls the function that stringifies and saves the task list into local storage
    renderTaskList(); // Refreshing the containers to show the task cards in the correct containers
    return;
}

// Todo: when the page loads, render the task list, add event listeners, make lanes droppable, and make the due date field a date picker
$(document).ready(function () {
    
    taskForm.on('submit', handleAddTask); // Listens for a submit even from the taskForm then calls handleAddTask to parse the input

    taskTable.on('click', '.btn-delete-project', handleDeleteTask); // Listens for a click on the delete button

    $('#task-due-date').datepicker({ // Datepicker jQuery widget for date input on the form
        changeMonth: true, changeYear: true});

    $('.lane').droppable({ // Droppable widget from jQueryUI, sets the element in the page that cards can be dropped onto
        accept: '.draggable', drop: handleDrop, tolerance: 'fit'});

      getTasksFromStorage(); // Checks localStorage for stored tasks and if it finds them loads them into the working array
      renderTaskList(); // Renders the task list to the lanes

});