import { useState, useEffect } from 'react'
import { database } from '@/lib/firebase'
import { ref, push, onValue, remove, update } from 'firebase/database'
import { Todo } from '../types'

export function useTodos() {
  const [todos, setTodos] = useState<Todo[]>([])
  const [userIP, setUserIP] = useState('')

  useEffect(() => {
    fetch('https://api.ipify.org?format=json')
      .then(response => response.json())
      .then(data => setUserIP(data.ip))

    const todosRef = ref(database, 'todos')
    onValue(todosRef, (snapshot) => {
      const data = snapshot.val()
      if (data) {
        const todoList = Object.entries(data).map(([id, todo]: [string, any]) => ({
          id,
          ...todo
        }))
        setTodos(todoList)
      } else {
        setTodos([])
      }
    })
  }, [])

  const addTodo = (text: string) => {
    const todosRef = ref(database, 'todos')
    push(todosRef, {
      text,
      completed: false,
      userIP,
      timestamp: Date.now()
    })
  }

  const toggleTodo = (todo: Todo) => {
    const todoRef = ref(database, `todos/${todo.id}`)
    update(todoRef, { completed: !todo.completed })
  }

  const deleteTodo = (id: string) => {
    const todoRef = ref(database, `todos/${id}`)
    remove(todoRef)
  }

  return {
    todos,
    addTodo,
    toggleTodo,
    deleteTodo
  }
} 