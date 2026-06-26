import { useState, type SubmitEvent } from 'react'
import './App.css'

const mockTodos = [
  {
    id: '1',
    title: 'Hacer ejercicio',
    completed: false
  },
  {
    id: '2',
    title: 'Hacer dieta',
    completed: false
  },
  {
    id: '3',
    title: 'Ir al supermercado',
    completed: false
  }
]

interface ToDo {
  id: string
  title: string
  completed: boolean
}

const App = (): React.JSX.Element => {
  const [todos, setTodos] = useState<ToDo[]>(mockTodos)

  const handleSubmit = (event: SubmitEvent<HTMLFormElement>) => {
    event.preventDefault()
    const formData = new FormData(event.currentTarget)
    const newTodoValue = formData.get('todo') as string | undefined
    if (!newTodoValue) return

    const newTodo: ToDo = {
      id: crypto.randomUUID(),
      title: newTodoValue,
      completed: false
    }
    setTodos((prevState) => {
      return [newTodo, ...prevState]
    })

    //event.currentTarget.reset()
    const inputElement = event.currentTarget.elements.namedItem('todo') as
      | HTMLInputElement
      | undefined
    if (inputElement) {
      inputElement.value = ''
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center py-12 px-4 sm:px-6 lg:px-8">
      <header className="w-full max-w-md">
        <h1 className="text-center text-4xl font-extrabold text-gray-900">To do TS</h1>
      </header>
      <main className="mt-8 w-full max-w-md">
        <form onSubmit={handleSubmit} className="bg-white shadow-md rounded-lg p-6">
          <label htmlFor="todo" className="sr-only">
            ¿Qué quieres hacer?
          </label>
          <input
            type="text"
            placeholder="¿Qué quieres hacer?"
            id="todo"
            name="todo"
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          <ul className="mt-4 divide-y divide-gray-200">
            {todos.map((todo) => {
              return (
                <li key={todo.id} className="py-2">
                  {todo.title}
                </li>
              )
            })}
          </ul>
        </form>
      </main>
    </div>
  )
}

export default App
