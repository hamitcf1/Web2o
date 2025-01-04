import { database } from './firebaseConfig';
import { ref, onValue } from "firebase/database";

// Function to read all to-do items for a user
export function readTodoItems(userId, callback) {
    const todosRef = ref(database, 'todos/' + userId);
    onValue(todosRef, (snapshot) => {
        const data = snapshot.val();
        callback(data); // Call the provided callback with the data
    });
} 