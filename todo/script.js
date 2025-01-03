class TodoList {
    constructor() {
        this.todos = JSON.parse(localStorage.getItem('todos')) || [];
        this.filter = 'all';
        this.setupEventListeners();
        this.render();
    }

    setupEventListeners() {
        // Form submission
        document.getElementById('todo-form').addEventListener('submit', e => {
            e.preventDefault();
            const input = document.getElementById('todo-input');
            const text = input.value.trim();
            if (text) {
                this.addTodo(text);
                input.value = '';
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

        // Clear completed
        document.getElementById('clear-completed').addEventListener('click', () => {
            this.todos = this.todos.filter(todo => !todo.completed);
            this.save();
            this.render();
        });
    }

    addTodo(text, date) {
        this.todos.push({
            id: Date.now(),
            text,
            completed: false,
            date
        });
        this.save();
        this.render();
    }

    toggleTodo(id) {
        const todo = this.todos.find(todo => todo.id === id);
        if (todo) {
            todo.completed = !todo.completed;
            this.save();
            this.render();
        }
    }

    deleteTodo(id) {
        this.todos = this.todos.filter(todo => todo.id !== id);
        this.save();
        this.render();
    }

    save() {
        localStorage.setItem('todos', JSON.stringify(this.todos));
    }

    formatDate(dateString) {
        if (!dateString) return '';
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', { 
            month: 'short', 
            day: 'numeric',
            year: 'numeric'
        });
    }

    render() {
        const list = document.getElementById('todo-list');
        const filteredTodos = this.todos.filter(todo => {
            if (this.filter === 'active') return !todo.completed;
            if (this.filter === 'completed') return todo.completed;
            return true;
        });

        list.innerHTML = filteredTodos.map(todo => `
            <li class="todo-item ${todo.completed ? 'completed' : ''}" data-id="${todo.id}">
                <input type="checkbox" ${todo.completed ? 'checked' : ''}>
                <span>${todo.text}</span>
                ${todo.date ? `<span class="todo-date">${this.formatDate(todo.date)}</span>` : ''}
                <button class="delete-btn">
                    <i class="fas fa-trash"></i>
                </button>
            </li>
        `).join('');

        // Update items left count
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
        });
    }
}

new TodoList(); 