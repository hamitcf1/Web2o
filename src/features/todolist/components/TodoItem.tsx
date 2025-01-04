import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Trash2 } from 'lucide-react'
import { Todo } from '../types'

interface TodoItemProps {
  todo: Todo
  onToggle: (todo: Todo) => void
  onDelete: (id: string) => void
}

export function TodoItem({ todo, onToggle, onDelete }: TodoItemProps) {
  return (
    <div className="flex items-center gap-2 p-2 border rounded">
      <Checkbox
        checked={todo.completed}
        onCheckedChange={() => onToggle(todo)}
      />
      <span className={todo.completed ? 'line-through text-muted-foreground' : ''}>
        {todo.text}
      </span>
      <Button
        variant="ghost"
        size="icon"
        className="ml-auto"
        onClick={() => onDelete(todo.id)}
      >
        <Trash2 className="h-4 w-4" />
      </Button>
    </div>
  )
} 