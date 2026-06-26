import { useState, type ChangeEvent, type SubmitEvent } from 'react'
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
  const [lengthTodos, setLengthTodos] = useState<number>(todos.length)

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

  const handleCompleted = ({
    event,
    todo
  }: {
    event: ChangeEvent<HTMLInputElement>
    todo: ToDo
  }) => {
    const newTodos = todos.map((item) => {
      if (item.id === todo.id) {
        return { ...item, completed: event.target.checked }
      }
      return item
    })
    const newLengthTodos = newTodos.filter((todo) => todo.completed !== true)
    setTodos(newTodos)
    setLengthTodos(newLengthTodos.length)
  }

  const handleDelete = () => {
    const pendingTodos = todos.filter((todo) => todo.completed === false)
    setTodos(pendingTodos)
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
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </form>
        <ul className="mt-4 divide-y divide-gray-200">
          {todos.map((todo) => {
            const isCompleted = todo.completed ? 'line-through text-slate-400' : ''
            return (
              <li key={todo.id} className={`py-2 ${isCompleted}`}>
                <input
                  onChange={(event) => {
                    handleCompleted({ event, todo })
                  }}
                  type="checkbox"
                  className="appearance-none h-8 w-8 rounded-full border-2 border-slate-300 bg-white checked:bg-indigo-600 checked:border-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all duration-200"
                />
                {todo.title}
              </li>
            )
          })}
        </ul>
        <footer className="flex items-center justify-between gap-4 p-3 bg-slate-50 rounded-xl">
          <span>
            {lengthTodos === 1
              ? `${lengthTodos} tarea pendiente`
              : `${lengthTodos} tareas
            pendientes`}
          </span>
          <button className="px-3 py-1 bg-indigo-600 text-white rounded-lg text-sm hover:bg-indigo-700">
            All
          </button>
          <button className="px-3 py-1 bg-indigo-600 text-white rounded-lg text-sm hover:bg-indigo-700">
            Active
          </button>
          <button className="px-3 py-1 bg-indigo-600 text-white rounded-lg text-sm hover:bg-indigo-700">
            Complete
          </button>
          {todos.length > lengthTodos ? (
            <button
              onClick={handleDelete}
              className="px-3 py-1 bg-indigo-600 text-white rounded-lg text-sm hover:bg-indigo-700"
            >
              Borrar Seleccionado
            </button>
          ) : null}
        </footer>
      </main>
    </div>
  )
}

export default App
