import Footer from './components/Footer'
import Todos from './components/Todos'
import { Filter_Todos } from './const/FilterTodos'
import useTodos from './hooks/useTodos'

const App = (): React.JSX.Element => {
  const {
    setFilterTodo,
    handleAddTodos,
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
    filterTodo
  } = useTodos()

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
