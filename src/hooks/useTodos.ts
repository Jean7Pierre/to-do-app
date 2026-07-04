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
import useDebounce from '../hooks/useDebounce'
import type { AppState, TodoId } from '../../types'
import { Filter_Todos } from '../const/FilterTodos'
import { reducer } from '../utility/reducerActionTodos'
import { dictTodosAction } from '../utility/dictTodosAction'

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

const useTodos = () => {
  const [state, dispatch] = useReducer(reducer, initialState)
  const [search, setSearch] = useState<string>('')
  const debounce = useDebounce(search, 300)
  const [filterTodo, setFilterTodo] = useState<filterTodosTS>(Filter_Todos.NONE)
  const masterCheckboxRef = useRef<HTMLInputElement>(null)

  const handleAddTodo = (event: SubmitEvent<HTMLFormElement>) => {
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

  const handleDeleteTodo = ({ id }: { id: TodoId }) => {
    dispatch({ type: 'DELETE_TODO', payload: { id } })
  }

  return {
    setFilterTodo,
    handleAddTodo,
    handleCompletedTodo,
    handleDeleteCompleted,
    handleSearchTodos,
    filteredTodos,
    handleMasterChange,
    handleEditTextTodo,
    completedTodosCount,
    search,
    masterCheckboxRef,
    isAllChecked,
    pendingTodosCount,
    filterTodo,
    handleDeleteTodo
  }
}

export default useTodos
