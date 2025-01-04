import { database } from './firebaseConfig';
import { ref, set, remove, push } from "firebase/database";

// Function to remove a to-do item
export function removeTodoItem(userId, todoId) {
    remove(ref(database, 'todos/' + userId + '/' + todoId))
        .catch((error) => {
            console.error("Error removing todo item: ", error);
        });
}

// Function to add a new task
export function addTask(taskText) {
    const dbRef = ref(database, 'tasks/');
    // Add new task with a unique key
    push(dbRef, {
        task: taskText,
        completed: false
    }).catch((error) => {
        console.error("Error adding task: ", error);
    });
}

// Function to set a specific task (overwrites if exists)
export function setTask(taskId, taskText) {
    const dbRef = ref(database, 'tasks/' + taskId);
    set(dbRef, {
        task: taskText,
        completed: false
    }).catch((error) => {
        console.error("Error setting task: ", error);
    });
} 