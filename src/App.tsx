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

  const handleMarkedAllTodos = () => {
    //desactivamos filtrado inicial en caso de que el usuario hiciera click anteriormente
    setFilterTodo(FilterTodos.NONE)
    const areAllCompleted = state.todos.every((todo) => todo.completed)
    const newStatus = !areAllCompleted

    dispatch({ type: 'TOGGLE_ALL', payload: { completed: newStatus } })
  }

  const handleActiveTodos = () => {
    const newState = filterTodo === FilterTodos.ACTIVE ? FilterTodos.NONE : FilterTodos.ACTIVE
    setFilterTodo(newState)
  }

  const handleCompleteTodos = () => {
    const newState = filterTodo === FilterTodos.COMPLETED ? FilterTodos.NONE : FilterTodos.COMPLETED
    setFilterTodo(newState)
  }

  const pendingTodosCount = state.todos.filter((todo) => !todo.completed).length

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center py-12 px-4 sm:px-6 lg:px-8">
      <header className="w-full max-w-md">
        <h1 className="text-center text-4xl font-extrabold text-gray-900">To do TS</h1>
      </header>
      <main className="mt-8 w-full max-w-md">
        <form onSubmit={(event) => event.preventDefault()} className="mb-4">
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
            {pendingTodosCount === 1
              ? `Mostrando ${filteredTodos.length} de ${pendingTodosCount} tarea pendiente`
              : `Mostrando ${filteredTodos.length} de ${pendingTodosCount} tareas
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
          {state.todos.length > pendingTodosCount ? (
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
