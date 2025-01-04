import { database } from './firebaseConfig';
import { ref, set, remove } from "firebase/database";

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