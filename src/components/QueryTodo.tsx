interface Props {
  handleSearchTodos: (event: React.ChangeEvent<HTMLInputElement>) => void
  search: string
}
const QueryTodo: React.FC<Props> = ({ handleSearchTodos, search }) => {
  return (
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
  )
}
export default QueryTodo
