// Import Firebase functions
import { initializeApp } from "firebase/app";
import { getDatabase, ref, onValue, set } from "firebase/database";

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyDB770zA8kQZTdCMqyZ0EO52KhGA4dlV6c",
    authDomain: "web2o-34840.firebaseapp.com",
    databaseURL: "https://web2o-34840-default-rtdb.firebaseio.com",
    projectId: "web2o-34840",
    storageBucket: "web2o-34840.appspot.com",
    messagingSenderId: "94338182985",
    appId: "1:94338182985:web:0da6cb9c254471c4cdb498",
    measurementId: "G-WCB0FLGL1S"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

class TodoList {
    constructor() {
        this.todos = [];
        this.filter = 'all';
        this.setupEventListeners();
        this.loadTodos();
    }

    loadTodos() {
        const todosRef = ref(database, 'todos');
        onValue(todosRef, snapshot => {
            this.todos = snapshot.val() || [];
            this.render();
        }, error => {
            console.error("Error loading todos: ", error);
        });
    }

    setupEventListeners() {
        document.getElementById('todo-form').addEventListener('submit', e => {
            e.preventDefault();
            const input = document.getElementById('todo-input');
            const dateInput = document.getElementById('todo-date');
            const text = input.value.trim();
            if (text) {
                this.addTodo(text, dateInput.value);
                input.value = '';
                dateInput.value = '';
                this.showToast('Task added successfully!', 'success');
            }
        });

        // Filter buttons
        document.querySelectorAll('.filter-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                document.querySelector('.filter-btn.active').classList.remove('active');
                btn.classList.add('active');
                this.filter = btn.dataset.filter;
                this.render();
            });
        });

        // Clear completed with confirmation
        document.getElementById('clear-completed').addEventListener('click', () => {
            const completedCount = this.todos.filter(todo => todo.completed).length;
            if (completedCount === 0) {
                this.showToast('No completed tasks to clear', 'info');
                return;
            }
            if (confirm(`Are you sure you want to clear ${completedCount} completed task${completedCount !== 1 ? 's' : ''}?`)) {
                this.todos = this.todos.filter(todo => !todo.completed);
                this.save();
                this.render();
                this.showToast('Completed tasks cleared', 'success');
            }
        });

        const dateInput = document.getElementById('todo-date');
        dateInput.addEventListener('focus', () => {
            dateInput.type = 'date';
        });
        dateInput.addEventListener('blur', () => {
            if (!dateInput.value) {
                dateInput.type = 'text';
            }
        });
    }

    addTodo(text, date) {
        const todo = {
            id: Date.now(),
            text,
            completed: false,
            date: date || null,
            createdAt: new Date().toISOString()
        };
        this.todos.unshift(todo);
        this.save();
        this.render();
    }

    toggleTodo(id) {
        const todo = this.todos.find(todo => todo.id === id);
        if (todo) {
            todo.completed = !todo.completed;
            this.save();
            this.render();
            this.showToast(todo.completed ? 'Task completed!' : 'Task uncompleted', 'info');
        }
    }

    deleteTodo(id) {
        const index = this.todos.findIndex(todo => todo.id === id);
        if (index !== -1) {
            const todo = this.todos[index];
            if (confirm(`Are you sure you want to delete "${todo.text}"?`)) {
                this.todos.splice(index, 1);
                this.save();
                this.render();
                this.showToast('Task deleted', 'warning');
            }
        }
    }

    formatDate(dateString) {
        if (!dateString) return '';
        const date = new Date(dateString);
        return new Intl.DateTimeFormat(navigator.language, { 
            dateStyle: 'medium'
        }).format(date);
    }

    showToast(message, type = 'info') {
        const toast = document.getElementById('toast');
        toast.textContent = message;
        toast.className = `toast toast-${type} show`;
        setTimeout(() => {
            toast.classList.remove('show');
        }, 3000);
    }

    save() {
        const todosRef = ref(database, 'todos');
        set(todosRef, this.todos)
            .catch(error => {
                console.error("Error saving todos: ", error);
            });
    }

    render() {
        const list = document.getElementById('todo-list');
        const emptyState = document.getElementById('empty-state');
        const filteredTodos = this.todos.filter(todo => {
            if (this.filter === 'active') return !todo.completed;
            if (this.filter === 'completed') return todo.completed;
            return true;
        });

        if (this.todos.length === 0) {
            emptyState.style.display = 'flex';
            list.style.display = 'none';
        } else {
            emptyState.style.display = 'none';
            list.style.display = 'block';
        }

        list.innerHTML = filteredTodos.map(todo => `
            <li class="todo-item ${todo.completed ? 'completed' : ''}" data-id="${todo.id}">
                <div class="todo-content">
                    <input type="checkbox" ${todo.completed ? 'checked' : ''}>
                    <span class="todo-text">${todo.text}</span>
                    ${todo.date ? `<span class="todo-date">${this.formatDate(todo.date)}</span>` : ''}
                </div>
                <button class="delete-btn" title="Delete task">
                    <i class="fas fa-trash"></i>
                </button>
            </li>
        `).join('');

        const itemsLeft = this.todos.filter(todo => !todo.completed).length;
        document.getElementById('items-left').textContent = 
            `${itemsLeft} item${itemsLeft !== 1 ? 's' : ''} left`;

        // Add event listeners to new elements
        list.querySelectorAll('.todo-item').forEach(item => {
            const id = parseInt(item.dataset.id);
            item.querySelector('input[type="checkbox"]').addEventListener('change', () => {
                this.toggleTodo(id);
            });
            item.querySelector('.delete-btn').addEventListener('click', () => {
                this.deleteTodo(id);
            });
            // Add animation class after a small delay
            setTimeout(() => item.classList.add('show'), 10);
        });
    }
}

new TodoList(); 