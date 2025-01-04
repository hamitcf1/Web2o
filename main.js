import { addTask } from './writeData';
import { readTasks } from './readData';

// Function to display tasks
function displayTasks(data) {
    const todoList = document.getElementById('todo-list');
    todoList.innerHTML = ''; // Clear existing items
    for (const [key, value] of Object.entries(data)) {
        const todoItem = document.createElement('div');
        todoItem.textContent = value.task;
        const removeButton = document.createElement('button');
        removeButton.textContent = 'Remove';
        removeButton.onclick = () => {
            // Implement remove functionality if needed
        };
        todoItem.appendChild(removeButton);
        todoList.appendChild(todoItem);
    }
}

// Adding a new task
document.getElementById('addTodoButton').onclick = () => {
    const todoInput = document.getElementById('todoInput');
    const todoText = todoInput.value;
    addTask(todoText); // Use the addTask function
    todoInput.value = ''; // Clear input field
};

// Reading all tasks
readTasks(displayTasks); // Pass the display function as a callback 