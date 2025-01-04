import { Card } from '@/components/ui/card'
import { TodoList } from '@/features/todolist/TodoList'
import { Calculator } from '@/features/calculator/Calculator'
import { RockPaperScissors } from '@/features/rock-paper-scissors/RockPaperScissors'

export default function Home() {
  return (
    <main className="container py-6 grid gap-6">
      <section className="grid gap-6">
        <h2 className="text-2xl font-bold">Projects</h2>
        <div className="grid gap-6 md:grid-cols-2">
          <Card className="p-4">
            <h3 className="text-xl font-semibold mb-4">Rock Paper Scissors</h3>
            <RockPaperScissors />
          </Card>

          <Card className="p-4">
            <h3 className="text-xl font-semibold mb-4">Calculator</h3>
            <Calculator />
          </Card>

          <Card className="p-4">
            <h3 className="text-xl font-semibold mb-4">Todo List</h3>
            <TodoList />
          </Card>
        </div>
      </section>
    </main>
  )
} 