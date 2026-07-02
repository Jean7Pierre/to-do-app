import {
  useCallback,
  useEffect,
  useReducer,
  useMemo,
  useState,
  type ChangeEvent,
  type SubmitEvent,
  useRef
} from 'react'
import './App.css'
import useDebounce from './hooks/useDebounce'
import Todos from './components/Todos'
import type { ToDo, AppState, TodoId } from '../types'
import Footer from './components/Footer'
import { Filter_Todos } from './const/FilterTodos'
import { reducer } from './utility/reducerActionTodos'

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

const initialState: AppState = {
  todos: mockTodos,
  history: [mockTodos]
}

type filterTodosTS = (typeof Filter_Todos)[keyof typeof Filter_Todos]

const App = (): React.JSX.Element => {
  const [state, dispatch] = useReducer(reducer, initialState)
  const [search, setSearch] = useState<string>('')
  const debounce = useDebounce(search, 300)
  const [filterTodo, setFilterTodo] = useState<filterTodosTS>(Filter_Todos.NONE)
  const masterCheckboxRef = useRef<HTMLInputElement>(null)

  const handleAddTodos = (event: SubmitEvent<HTMLFormElement>) => {
    event.preventDefault()
    const formData = new FormData(event.currentTarget)
    const newTodoValue = formData.get('todo') as string | undefined
    if (!newTodoValue) return

    dispatch({ type: 'ADD_TODO', payload: { title: newTodoValue } })

    //event.currentTarget.reset()
    const inputElement = event.currentTarget.elements.namedItem('todo') as HTMLInputElement | undefined
    if (inputElement) {
      inputElement.value = ''
    }
  }

  const handleCompletedTodo = ({ event, id }: { event: ChangeEvent<HTMLInputElement>; id: TodoId }) => {
    dispatch({
      type: 'TOGGLE_COMPLETE',
      payload: { id, completed: event.target.checked }
    })
  }

  const handleDeleteCompleted = () => {
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
    [Filter_Todos.NONE]: (todos) => todos,
    [Filter_Todos.ACTIVE]: (todos) => todos.filter((todo) => todo.completed === false),
    [Filter_Todos.COMPLETED]: (todos) => todos.filter((todo) => todo.completed === true)
  }

  const filteredTodos = useMemo(() => {
    const todosToFilter =
      debounce === ''
        ? state.todos
        : state.todos.filter((todo) => todo.title.toLowerCase().includes(debounce.toLowerCase()))

    return dictTodosAction[filterTodo](todosToFilter)
  }, [filterTodo, debounce, state.todos])

  const handleMasterChange = () => {
    // Si todos están marcados, desmarca todos. Si no, marca todos.
    const shouldCheckAll = !isAllChecked
    dispatch({ type: 'TOGGLE_MARKED_ALL', payload: { completed: shouldCheckAll } })
  }

  const totalItems = state.todos.length
  const pendingTodosCount = state.todos.filter((todo) => !todo.completed).length
  const completedTodosCount = totalItems - pendingTodosCount
  const checkedItems = state.todos.filter((item) => item.completed).length
  const isAllChecked = totalItems > 0 && checkedItems === totalItems
  const isIndeterminate = checkedItems > 0 && checkedItems < totalItems

  // 4. Efecto para aplicar la propiedad indeterminada directamente al DOM
  useEffect(() => {
    if (masterCheckboxRef.current) {
      masterCheckboxRef.current.indeterminate = isIndeterminate
    }
  }, [isIndeterminate])

  const handleEditTextTodo = ({ event, id }: { event: ChangeEvent<HTMLInputElement>; id: TodoId }) => {
    const value = event.currentTarget.value
    dispatch({ type: 'EDIT_TODO_TEXT', payload: { title: value, id } })
  }

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
        <div>
          <label style={{ fontWeight: 'bold', display: 'block', marginBottom: '10px' }}>
            <input
              type="checkbox"
              ref={masterCheckboxRef}
              checked={isAllChecked}
              onChange={handleMasterChange}
            />
            {isAllChecked ? ' Desmarcar todos' : ' Marcar todos'}
          </label>
        </div>
        <Todos
          todos={filteredTodos}
          handleCompletedTodo={handleCompletedTodo}
          handleEditTextTodo={handleEditTextTodo}
        />

        <Footer
          pendingTodosCount={pendingTodosCount}
          filterTodo={filterTodo}
          setFilterTodo={setFilterTodo}
          FilterTodos={Filter_Todos}
          completedTodosCount={completedTodosCount}
          handleDeleteCompleted={handleDeleteCompleted}
        />
      </main>
    </div>
  )
}

export default App
