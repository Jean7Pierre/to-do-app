import type { Filter_Todos } from '../const/FilterTodos'

type filterTodosTS = (typeof Filter_Todos)[keyof typeof Filter_Todos]

interface Props {
  pendingTodosCount: number
  filterTodo: filterTodosTS
  FilterTodos: typeof Filter_Todos
  completedTodosCount: number
  setFilterTodo: React.Dispatch<React.SetStateAction<'COMPLETED' | 'ACTIVE' | 'NONE'>>
  handleDeleteCompleted: () => void
}

const Footer: React.FC<Props> = ({
  pendingTodosCount,
  filterTodo,
  setFilterTodo,
  FilterTodos,
  completedTodosCount,
  handleDeleteCompleted
}) => {
  return (
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
          onClick={handleDeleteCompleted}
          className="text-sm text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-300 font-medium"
        >
          Borrar completadas
        </button>
      ) : null}
    </footer>
  )
}
export default Footer
