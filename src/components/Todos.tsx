import type { ChangeEvent, FC } from 'react'
import { type ListOfTodos, type TodoId } from '../../types'
import { AnimatePresence } from 'motion/react'
import Todo from './Todo'

interface Props {
  todos: ListOfTodos
  handleCompletedTodo: ({ event, id }: { event: ChangeEvent<HTMLInputElement>; id: TodoId }) => void
  handleEditTextTodo: ({ event, id }: { event: ChangeEvent<HTMLInputElement>; id: TodoId }) => void
  handleDeleteTodo: ({ id }: { id: TodoId }) => void
}

const Todos: FC<Props> = ({ todos, handleDeleteTodo, handleCompletedTodo, handleEditTextTodo }) => {
  return (
    <div className="bg-white dark:bg-gray-800 shadow-lg rounded-xl h-96 overflow-y-auto">
      <ul className="divide-y divide-gray-200 dark:divide-gray-700">
        {/* 1. AnimatePresence detecta cuándo se eliminan o filtran elementos */}
        <AnimatePresence mode="popLayout">
          {todos.map((todo) => (
            <Todo
              id={todo.id}
              title={todo.title}
              completed={todo.completed}
              handleEditTextTodo={handleEditTextTodo}
              handleCompletedTodo={handleCompletedTodo}
              handleDeleteTodo={handleDeleteTodo}
            />
          ))}
        </AnimatePresence>
      </ul>

      {/* Si está vacío, el texto se inyecta directamente debajo en el mismo contenedor */}
      {todos.length === 0 && (
        <div className="flex h-full items-center justify-center p-4">
          <p className="text-gray-500 dark:text-gray-400">No hay tareas por aquí.</p>
        </div>
      )}
    </div>
  )
}
export default Todos
