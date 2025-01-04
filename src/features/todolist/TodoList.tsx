import { Card } from '@/components/ui/card'
import { TodoForm } from './components/TodoForm'
import { TodoItem } from './components/TodoItem'
import { useTodos } from './hooks/useTodos'

export function TodoList() {
  const { todos, addTodo, toggleTodo, deleteTodo } = useTodos()

  return (
    <Card className="p-4">
      <TodoForm onAddTodo={addTodo} />
      <div className="space-y-2">
        {todos.map((todo) => (
          <TodoItem
            key={todo.id}
            todo={todo}
            onToggle={toggleTodo}
            onDelete={deleteTodo}
          />
        ))}
      </div>
    </Card>
  )
} 