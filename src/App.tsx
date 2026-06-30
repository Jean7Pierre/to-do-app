import {
  useCallback,
  useEffect,
  useReducer,
  useMemo,
  useState,
  type ChangeEvent,
  type SubmitEvent
} from 'react'
import './App.css'
import useDebounce from './hooks/useDebounce'

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

interface AppState {
  todos: ToDo[]
  history: ToDo[][]
}

type Action =
  | { type: 'ADD_TODO'; payload: { title: string } }
  | { type: 'TOGGLE_COMPLETE'; payload: { id: string; completed: boolean } }
  | { type: 'DELETE_COMPLETED' }
  | { type: 'TOGGLE_ALL'; payload: { completed: boolean } }
  | { type: 'UNDO' }

const initialState: AppState = {
  todos: mockTodos,
  history: [mockTodos]
}

const reducer = (state: AppState, action: Action): AppState => {
  switch (action.type) {
    case 'ADD_TODO': {
      const newTodo: ToDo = {
        id: crypto.randomUUID(),
        title: action.payload.title,
        completed: false
      }
      const newTodos = [newTodo, ...state.todos]
      return {
        ...state,
        history: [...state.history, newTodos],
        todos: newTodos
      }
    }
    case 'TOGGLE_COMPLETE': {
      const newTodos = state.todos.map((todo) => {
        if (todo.id === action.payload.id) {
          return { ...todo, completed: action.payload.completed }
        }
        return todo
      })
      return {
        ...state,
        history: [...state.history, newTodos],
        todos: newTodos
      }
    }
    case 'DELETE_COMPLETED': {
      const newTodos = state.todos.filter((todo) => !todo.completed)
      return {
        ...state,
        history: [...state.history, newTodos],
        todos: newTodos
      }
    }
    case 'TOGGLE_ALL': {
      const newTodos = state.todos.map((todo) => ({
        ...todo,
        completed: action.payload.completed
      }))
      return {
        ...state,
        history: [...state.history, newTodos],
        todos: newTodos
      }
    }
    case 'UNDO': {
      if (state.history.length <= 1) {
        return state
      }
      const newHistory = state.history.slice(0, -1)
      const lastTodos = newHistory[newHistory.length - 1]
      return {
        ...state,
        history: newHistory,
        todos: lastTodos
      }
    }
    default:
      return state
  }
}

const App = (): React.JSX.Element => {
  const [state, dispatch] = useReducer(reducer, initialState)
  const [search, setSearch] = useState<string>('')
  const debounce = useDebounce(search, 300)
  const [filterTodo, setFilterTodo] = useState<filterTodosTS>(FilterTodos.NONE)

  const handleAddTodos = (event: SubmitEvent<HTMLFormElement>) => {
    event.preventDefault()
    const formData = new FormData(event.currentTarget)
    const newTodoValue = formData.get('todo') as string | undefined
    if (!newTodoValue) return

    dispatch({ type: 'ADD_TODO', payload: { title: newTodoValue } })

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
    dispatch({
      type: 'TOGGLE_COMPLETE',
      payload: { id: todo.id, completed: event.target.checked }
    })
  }

  const handleDeleteTodo = () => {
    dispatch({ type: 'DELETE_COMPLETED' })
  }

  const undo = useCallback((event: KeyboardEvent) => {
    if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 'z') {
      dispatch({ type: 'UNDO' })
    }
  }, []) // dispatch is stable and doesn't need to be in the dependency array

  useEffect(() => {
    window.addEventListener('keydown', undo)

    return () => {
      window.removeEventListener('keydown', undo)
    }
  }, [undo]) // undo is stable due to useCallback

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
    const todosToFilter =
      debounce === ''
        ? state.todos
        : state.todos.filter((todo) => todo.title.toLowerCase().includes(debounce.toLowerCase()))

    return dictTodosAction[filterTodo](todosToFilter)
  }, [filterTodo, debounce, state.todos])

  /*
  const handleMarkedAllTodos = () => {
    //desactivamos filtrado inicial en caso de que el usuario hiciera click anteriormente
    setFilterTodo(FilterTodos.NONE)
    const areAllCompleted = state.todos.every((todo) => todo.completed)
    const newStatus = !areAllCompleted

    dispatch({ type: 'TOGGLE_ALL', payload: { completed: newStatus } })
  }
*/
  const pendingTodosCount = state.todos.filter((todo) => !todo.completed).length
  const completedTodosCount = state.todos.length - pendingTodosCount

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-gray-200 flex flex-col items-center py-12 px-4 sm:px-6 lg:px-8">
      <header className="w-full max-w-xl mb-8">
        <h1 className="text-center text-5xl font-bold text-indigo-600 dark:text-indigo-400 tracking-tight">
          To-do TS
        </h1>
      </header>
      <main className="w-full max-w-xl space-y-6">
        <div className="bg-white dark:bg-gray-800 shadow-lg rounded-xl p-4">
          <form onSubmit={handleAddTodos}>
            <input
              type="text"
              placeholder="¿Qué quieres hacer hoy?"
              id="todo"
              name="todo"
              required
              autoFocus
              className="w-full px-4 py-3 bg-transparent border-none rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 text-lg placeholder:text-gray-400 dark:placeholder:text-gray-500"
            />
          </form>
          <div className="mt-4 border-t border-gray-200 dark:border-gray-700 pt-4">
            <input
              onChange={handleSearchTodos}
              type="search"
              placeholder="Buscar tareas..."
              name="search"
              value={search}
              className="w-full px-4 py-2 bg-gray-100 dark:bg-gray-700 border border-transparent rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 shadow-lg rounded-xl h-96 overflow-y-auto">
          {filteredTodos.length > 0 ? (
            <ul className="divide-y divide-gray-200 dark:divide-gray-700">
              {filteredTodos.map((todo) => (
                <li key={todo.id} className="flex items-center p-4 group">
                  <input
                    checked={todo.completed}
                    onChange={(event) => {
                      handleCompletedTodo({ event, todo })
                    }}
                    type="checkbox"
                    className="h-6 w-6 rounded-full text-indigo-600 border-gray-300 dark:border-gray-600 focus:ring-indigo-500 dark:bg-gray-700 dark:checked:bg-indigo-500 transition duration-150 ease-in-out cursor-pointer"
                  />
                  <span
                    className={`ml-4 flex-1 text-lg ${todo.completed ? 'line-through text-gray-400 dark:text-gray-500' : 'text-gray-800 dark:text-gray-200'}`}
                  >
                    {todo.title}
                  </span>
                </li>
              ))}
            </ul>
          ) : (
            <div className="flex h-full items-center justify-center">
              <p className="text-gray-500 dark:text-gray-400">No hay tareas por aquí.</p>
            </div>
          )}
        </div>

        <footer className="flex items-center justify-between gap-4 p-4 bg-white dark:bg-gray-800 shadow-lg rounded-xl">
          <span className="text-sm text-gray-500 dark:text-gray-400">
            {pendingTodosCount} {pendingTodosCount === 1 ? 'tarea pendiente' : 'tareas pendientes'}
          </span>

          <div className="flex gap-2">
            <button
              onClick={() => {
                setFilterTodo(FilterTodos.NONE)
              }}
              type="button"
              className={`px-3 py-1 text-sm font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 dark:focus:ring-offset-gray-800 focus:ring-indigo-500 ${
                filterTodo === FilterTodos.NONE
                  ? 'bg-indigo-100 dark:bg-indigo-900/50 text-indigo-700 dark:text-indigo-300'
                  : 'text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
              }`}
            >
              Todas
            </button>
            <button
              onClick={() => {
                setFilterTodo(FilterTodos.ACTIVE)
              }}
              type="button"
              className={`px-3 py-1 text-sm font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 dark:focus:ring-offset-gray-800 focus:ring-indigo-500 ${
                filterTodo === FilterTodos.ACTIVE
                  ? 'bg-indigo-100 dark:bg-indigo-900/50 text-indigo-700 dark:text-indigo-300'
                  : 'text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
              }`}
            >
              Activas
            </button>
            <button
              onClick={() => {
                setFilterTodo(FilterTodos.COMPLETED)
              }}
              type="button"
              className={`px-3 py-1 text-sm font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 dark:focus:ring-offset-gray-800 focus:ring-indigo-500 ${
                filterTodo === FilterTodos.COMPLETED
                  ? 'bg-indigo-100 dark:bg-indigo-900/50 text-indigo-700 dark:text-indigo-300'
                  : 'text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
              }`}
            >
              Completadas
            </button>
          </div>

          {completedTodosCount > 0 ? (
            <button
              onClick={handleDeleteTodo}
              className="text-sm text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-300 font-medium"
            >
              Borrar completadas
            </button>
          ) : null}
        </footer>
      </main>
    </div>
  )
}

export default App
