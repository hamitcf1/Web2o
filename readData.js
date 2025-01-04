import { database } from './firebaseConfig';
import { ref, onValue } from "firebase/database";

// Function to read all tasks
export function readTasks(callback) {
    const dbRef = ref(database, 'tasks/');
    // Listen for data changes
    onValue(dbRef, (snapshot) => {
        const data = snapshot.val();
        callback(data); // Call the provided callback with the data
    });
} 