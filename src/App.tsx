import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ChangeEvent,
  type SubmitEvent
} from 'react'
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

const FilterTodos = {
  COMPLETED: 'COMPLETED',
  ACTIVE: 'ACTIVE',
  NONE: 'NONE'
} as const

type filterTodosTS = keyof typeof FilterTodos

const App = (): React.JSX.Element => {
  const [todos, setTodos] = useState<ToDo[]>(mockTodos)
  const [lengthTodos, setLengthTodos] = useState<number>(todos.length)
  const history = useRef<ToDo[][]>([mockTodos])
  const [search, setSearch] = useState<string>('')
  const [debounce, setDebounce] = useState<string>(search)
  const [filterTodo, setFilterTodo] = useState<filterTodosTS>(FilterTodos.NONE)

  const handleAddTodos = (event: SubmitEvent<HTMLFormElement>) => {
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

    history.current = [...history.current, todos]

    setLengthTodos((prevState) => prevState + 1)

    //event.currentTarget.reset()
    const inputElement = event.currentTarget.elements.namedItem('todo') as
      | HTMLInputElement
      | undefined
    if (inputElement) {
      inputElement.value = ''
    }
  }

  const handleCompletedTodo = ({
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
    history.current = [...history.current, todos]
  }

  const handleDeleteTodo = () => {
    const pendingTodos = todos.filter((todo) => todo.completed === false)
    setTodos(pendingTodos)
    history.current = [...history.current, todos]
  }

  const undo = useCallback((event: KeyboardEvent) => {
    if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 'z') {
      if (history.current.length <= 1) return

      const newHistory = history.current.slice(0, -1)
      const lastSnapShot = history.current[history.current.length - 1]

      history.current = newHistory
      setTodos(lastSnapShot)
      setLengthTodos(lastSnapShot.filter((todo) => !todo.completed).length)
    }
  }, [])

  useEffect(() => {
    window.addEventListener('keydown', undo)

    return () => {
      window.removeEventListener('keydown', undo)
    }
  }, [undo])

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebounce(search)
    }, 300)

    return () => {
      clearTimeout(timer)
    }
  }, [search])

  const handleSearchTodos = (event: ChangeEvent<HTMLInputElement>) => {
    const searchValue = event.currentTarget.value
    if (searchValue === ' ') return
    setSearch(searchValue)
  }

  const dictTodosAction: Record<filterTodosTS, (todos: ToDo[]) => ToDo[]> = {
    [FilterTodos.NONE]: (todos) => todos,
    [FilterTodos.ACTIVE]: (todos) => todos.filter((todo) => todo.completed === false),
    [FilterTodos.COMPLETED]: (todos) => todos.filter((todo) => todo.completed === true)
  }

  const filteredTodos = useMemo(() => {
    if (debounce === '') {
      const newTodos = [...todos]
      return dictTodosAction[filterTodo](newTodos)
    } else {
      const todosFiltrado = todos.filter((todo) =>
        todo.title.toLowerCase().includes(debounce.toLowerCase())
      )
      return dictTodosAction[filterTodo](todosFiltrado)
    }
  }, [filterTodo, debounce, todos])

  //aca esta fallando hay que pasarle los todos por parametro para que actue con los valores filtrados
  const handleMarkedAllTodos = () => {
    //desactivamos filtrado inicial en caso de que el usuario hiciera click anteriormente
    setFilterTodo(FilterTodos.NONE)
    setTodos((prevState) => {
      // 1. Verificamos si YA todas las tareas están completadas
      const areAllCompleted = prevState.every((todo) => todo.completed)

      // 2. Si todas están completadas, queremos desmarcarlas (false).
      //    Si falta alguna por completar, queremos marcarlas todas (true).
      const newStatus = !areAllCompleted

      // 3. Retornamos el nuevo mapa inmutable
      return prevState.map((todo) => {
        // Si ya tiene el estado deseado, retornamos una copia superficial sin cambios
        if (todo.completed === newStatus) return { ...todo }

        // Si no, le aplicamos el nuevo estado
        return {
          ...todo,
          completed: newStatus
        }
      })
    })
  }

  const handleActiveTodos = () => {
    const newState = filterTodo === FilterTodos.ACTIVE ? FilterTodos.NONE : FilterTodos.ACTIVE
    setFilterTodo(newState)
  }

  const handleCompleteTodos = () => {
    const newState = filterTodo === FilterTodos.COMPLETED ? FilterTodos.NONE : FilterTodos.COMPLETED
    setFilterTodo(newState)
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center py-12 px-4 sm:px-6 lg:px-8">
      <header className="w-full max-w-md">
        <h1 className="text-center text-4xl font-extrabold text-gray-900">To do TS</h1>
      </header>
      <main className="mt-8 w-full max-w-md">
        <form onSubmit={(event) => event.preventDefault()}>
          <label htmlFor="search">Buscar todos:</label>
          <input
            onChange={handleSearchTodos}
            type="search"
            placeholder="go to the mountains"
            name="search"
            value={search}
          />
        </form>
        <form onSubmit={handleAddTodos} className="bg-white shadow-md rounded-lg p-6">
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
          {filteredTodos.map((todo) => {
            const isCompleted = todo.completed ? 'line-through text-slate-400' : ''
            return (
              <li key={todo.id} className={`py-2 ${isCompleted}`}>
                <input
                  checked={todo.completed}
                  onChange={(event) => {
                    handleCompletedTodo({ event, todo })
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
              ? `Mostrando ${filteredTodos.length} de ${lengthTodos} tarea pendiente`
              : `Mostrando ${filteredTodos.length} de ${lengthTodos} tareas
            pendientes`}
          </span>
          <button
            onClick={handleMarkedAllTodos}
            type="button"
            className="px-3 py-1 bg-indigo-600 text-white rounded-lg text-sm hover:bg-indigo-700"
          >
            All
          </button>
          <button
            onClick={handleActiveTodos}
            type="button"
            className="px-3 py-1 bg-indigo-600 text-white rounded-lg text-sm hover:bg-indigo-700"
          >
            Active
          </button>
          <button
            onClick={handleCompleteTodos}
            type="button"
            className="px-3 py-1 bg-indigo-600 text-white rounded-lg text-sm hover:bg-indigo-700"
          >
            Complete
          </button>
          {todos.length > lengthTodos ? (
            <button
              onClick={handleDeleteTodo}
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
