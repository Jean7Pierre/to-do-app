import AddNewTodo from './components/AddNewTodo'
import Footer from './components/Footer'
import QueryTodo from './components/QueryTodo'
import Todos from './components/Todos'
import { Filter_Todos } from './const/FilterTodos'
import useTodos from './hooks/useTodos'

const App = (): React.JSX.Element => {
  const {
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
          <AddNewTodo handleAddTodo={handleAddTodo} />
          <QueryTodo handleSearchTodos={handleSearchTodos} search={search} />
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
          handleDeleteTodo={handleDeleteTodo}
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
