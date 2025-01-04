import { database } from './firebaseConfig.js';
import { ref, set, get, child } from "firebase/database";

// Function to write data to the database
function writeUserData(userId, name, email) {
    set(ref(database, 'users/' + userId), {
        username: name,
        email: email
    });
}

// Function to read data from the database
function readUserData(userId) {
    const dbRef = ref(database);
    get(child(dbRef, 'users/' + userId)).then((snapshot) => {
        if (snapshot.exists()) {
            console.log(snapshot.val());
        } else {
            console.log("No data available");
        }
    }).catch((error) => {
        console.error(error);
    });
}

// Example usage
writeUserData('1', 'John Doe', 'john@example.com');
readUserData('1'); 