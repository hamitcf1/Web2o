import { addTodoItem, removeTodoItem } from './writeData';
import { readTodoItems } from './readData';

// Example user ID
const userId = 'user123';

// Function to display to-do items
function displayTodoItems(data) {
    const todoList = document.getElementById('todo-list');
    todoList.innerHTML = ''; // Clear existing items
    for (const [key, value] of Object.entries(data)) {
        const todoItem = document.createElement('div');
        todoItem.textContent = value.text;
        const removeButton = document.createElement('button');
        removeButton.textContent = 'Remove';
        removeButton.onclick = () => {
            removeTodoItem(userId, key);
        };
        todoItem.appendChild(removeButton);
        todoList.appendChild(todoItem);
    }
}

// Adding a new to-do item
document.getElementById('addTodoButton').onclick = () => {
    const todoInput = document.getElementById('todoInput');
    const todoText = todoInput.value;
    const todoId = Date.now().toString(); // Unique ID based on timestamp
    addTodoItem(userId, todoId, todoText);
    todoInput.value = ''; // Clear input field
};

// Reading all to-do items
readTodoItems(userId, displayTodoItems); 