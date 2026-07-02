interface Props {
  handleAddTodo: (event: React.SubmitEvent<HTMLFormElement>) => void
}
const AddNewTodo: React.FC<Props> = ({ handleAddTodo }) => {
  return (
    <form onSubmit={handleAddTodo}>
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
  )
}
export default AddNewTodo
