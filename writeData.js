import { database } from './firebaseConfig';
import { ref, set, remove, push } from "firebase/database";

function writeUserData(userId, name, email) {
    set(ref(database, 'users/' + userId), {
        username: name,
        email: email
    });
}

// Function to add a new to-do item
export function addTodoItem(userId, todoId, todoText) {
    set(ref(database, 'todos/' + userId + '/' + todoId), {
        text: todoText,
        completed: false
    });
}

// Function to remove a to-do item
export function removeTodoItem(userId, todoId) {
    remove(ref(database, 'todos/' + userId + '/' + todoId));
}

// Function to add a new task
export function addTask(taskText) {
    const dbRef = ref(database, 'tasks/');
    // Add new task with a unique key
    push(dbRef, {
        task: taskText,
        completed: false
    });
}

// Function to set a specific task (overwrites if exists)
export function setTask(taskId, taskText) {
    const dbRef = ref(database, 'tasks/' + taskId);
    set(dbRef, {
        task: taskText,
        completed: false
    });
} 