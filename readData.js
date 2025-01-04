import { database } from './firebaseConfig';
import { ref, onValue } from "firebase/database";

// Function to read all tasks
export function readTasks(callback) {
    const dbRef = ref(database, 'tasks/');
    // Listen for data changes
    onValue(dbRef, (snapshot) => {
        const data = snapshot.val();
        if (data) {
            callback(data); // Call the provided callback with the data
        } else {
            console.warn("No tasks found.");
            callback({}); // Call with empty object if no data
        }
    }, (error) => {
        console.error("Error reading tasks: ", error);
    });
} 