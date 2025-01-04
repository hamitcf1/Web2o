import React, { useState } from 'react';
import { database } from '../firebase-config';
import { ref, onValue, push, remove, update } from 'firebase/database';
import './TodoListCard.css';

function TodoListCard() {
  const [isExpanded, setIsExpanded] = useState(false);
  const [todos, setTodos] = useState([]);
  const [newTodo, setNewTodo] = useState("");
  const todosRef = ref(database, 'todos');

  React.useEffect(() => {
    onValue(todosRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const todosArray = Object.entries(data).map(([id, todo]) => ({
          id,
          ...todo
        }));
        setTodos(todosArray);
      } else {
        setTodos([]);
      }
    });
  }, []);

  const addTodo = async (e) => {
    e.preventDefault();
    if (newTodo.trim() !== "") {
      try {
        await push(todosRef, {
          text: newTodo,
          completed: false,
          timestamp: Date.now()
        });
        setNewTodo("");
      } catch (error) {
        console.error("Error adding todo:", error);
      }
    }
  };

  const deleteTodo = async (id) => {
    const todoRef = ref(database, `todos/${id}`);
    await remove(todoRef);
  };

  const toggleComplete = async (id, completed) => {
    const todoRef = ref(database, `todos/${id}`);
    await update(todoRef, {
      completed: !completed
    });
  };

  return (
    <div className="project-card todolist-card">
      <div className="card-header" onClick={() => setIsExpanded(!isExpanded)}>
        <h3>TodoList App</h3>
        <span className={`expand-icon ${isExpanded ? 'expanded' : ''}`}>▼</span>
      </div>
      
      {isExpanded && (
        <div className="card-content">
          <form className="todo-input-container" onSubmit={addTodo}>
            <input
              type="text"
              value={newTodo}
              onChange={(e) => setNewTodo(e.target.value)}
              placeholder="Add a new todo"
            />
            <button type="submit">Add</button>
          </form>
          
          <ul className="todo-list-compact">
            {todos.map((todo) => (
              <li key={todo.id} className={todo.completed ? "completed" : ""}>
                <input
                  type="checkbox"
                  checked={todo.completed}
                  onChange={() => toggleComplete(todo.id, todo.completed)}
                />
                <span>{todo.text}</span>
                <button 
                  className="delete-btn"
                  onClick={() => deleteTodo(todo.id)}
                >
                  ×
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default TodoListCard; 