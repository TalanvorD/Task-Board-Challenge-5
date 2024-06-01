# Task-Board-Challenge-5
Task Board using 3rd party APIs

## User Story

```md
AS A project team member with multiple tasks to organize
I WANT a task board 
SO THAT I can add individual project tasks, manage their state of progress and track overall project progress accordingly
```

## Acceptance Criteria

```md
GIVEN a task board to manage a project
WHEN I open the task board
THEN the list of project tasks is displayed in columns representing the task progress state (Not Yet Started, In Progress, Completed)
WHEN I view the task board for the project
THEN each task is color coded to indicate whether it is nearing the deadline (yellow) or is overdue (red)
WHEN I click on the button to define a new task
THEN I can enter the title, description and deadline date for the new task into a modal dialog
WHEN I click the save button for that task
THEN the properties for that task are saved in localStorage
WHEN I drag a task to a different progress column
THEN the task's progress state is updated accordingly and will stay in the new column after refreshing
WHEN I click the delete button for a task
THEN the task is removed from the task board and will not be added back after refreshing
WHEN I refresh the page
THEN the saved tasks persist
```

## First notes

This project starts with an already existing template so I will be working within that structure.  
There is an "Add Task" button and 3 columns "To Do", "In Progress" and "Done.  
The "Add Task" button should summon a modal dialog that contains a form that can accept input about a new task.  
That input will need to be processed and saved into localStorage so that it can persist between sessions.  
That saved input will be used to create individual cards that will have a title, description, due date and delete button.  
Those cards will be color coded to indicate if the task is nearing the due date (yellow) or past due (red).  
Those cards will also need to be dragged between the columns and the status will be updated depending on the column lands in.  
The Delete button will remove the cards from the screen and localStorage.  
Days.js, Bootstrap and jQuery all will be utilized.  

## Steps taken

- Modal containing the form for input created.
    - Modal and form taken from Bootstrap documentation and modified to suit the users needs.
    - Form contains inputs for "Task Title", "Task Due Date" and "Task Description".
    - The due date input uses the jQuery .datepicker widget for selecting dates.

- JavaScript logic.
    - Process the form input into an object, adds a unique id number and stores it into an array.
    - Function created to stringify the array with json and puts it into localStorage.
    - Function created to retrieve that array back from localStorage.
    - Function created to generate cards using those objects, checking the date key with Days.js to change the colors if needed.
    - Function created to render those cards onto the page, sorting them into the appropriate status columns.
        - Using the draggable/drobbale jQuery UI widgets to make those cards draggable between those columns.
    - Function created to remove cards once the Delete button is clicked and then columns are redrawn.
    - Function created to sort the object array by date so the tasks will show in ascending order.
        - Not part of the acceptance criteria but thought it would be nice to add.
     

![Task-Board-Screenshot](https://github.com/TalanvorD/Task-Board-Challenge-5/assets/164896317/28f0afa8-a772-45ed-8151-b3249a4a1ff1)
