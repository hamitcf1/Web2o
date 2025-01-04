import './TodoList.css';
import { useState, useEffect } from 'react';
import { database } from '../firebase-config';
import { ref, onValue, push, remove, update } from 'firebase/database';

function TodoList() {
  const [todos, setTodos] = useState([]);
  const [newTodo, setNewTodo] = useState("");
  const todosRef = ref(database, 'todos');

  // Fetch todos from Firebase
  useEffect(() => {
    onValue(todosRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        // Convert the object to array and add the key as id
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

  // Add todo
  const addTodo = async (e) => {
    e.preventDefault(); // Prevent form submission
    if (newTodo.trim() !== "") {
      push(todosRef, {
        text: newTodo,
        completed: false
      });
      setNewTodo("");
    }
  };

  // Delete todo
  const deleteTodo = async (id) => {
    const todoRef = ref(database, `todos/${id}`);
    await remove(todoRef);
  };

  // Toggle todo completion
  const toggleComplete = async (id, completed) => {
    const todoRef = ref(database, `todos/${id}`);
    await update(todoRef, {
      completed: !completed
    });
  };

  return (
    <div className="todo-container">
      <h1>Todo List</h1>
      <form className="input-container" onSubmit={addTodo}>
        <input
          type="text"
          value={newTodo}
          onChange={(e) => setNewTodo(e.target.value)}
          placeholder="Add a new todo"
        />
        <button type="submit">Add Todo</button>
      </form>
      <ul className="todo-list">
        {todos.map((todo) => (
          <li key={todo.id} className={todo.completed ? "completed" : ""}>
            <input
              type="checkbox"
              checked={todo.completed}
              onChange={() => toggleComplete(todo.id, todo.completed)}
            />
            <span>{todo.text}</span>
            <button onClick={() => deleteTodo(todo.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default TodoList; 