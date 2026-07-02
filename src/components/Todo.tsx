import type { ChangeEvent, FC } from 'react'
import { motion } from 'motion/react'
import type { TodoCompleted, TodoId, TodoTitle } from '../../types'

interface Props {
  id: TodoId
  completed: TodoCompleted
  title: TodoTitle
  handleCompletedTodo: ({ event, id }: { event: ChangeEvent<HTMLInputElement>; id: TodoId }) => void
  handleEditTextTodo: ({ event, id }: { event: ChangeEvent<HTMLInputElement>; id: TodoId }) => void
}

const Todo: FC<Props> = ({ id, completed, title, handleCompletedTodo, handleEditTextTodo }) => {
  return (
    // 2. Convertimos el li en motion.li y agregamos las propiedades de animación
    <motion.li
      key={id} // Obligatorio: debe ser el ID único de la tarea
      layout // Alerta a Framer Motion para animar reordenamientos y cambios de tamaño
      initial={{ opacity: 0, y: -15 }} // Cómo nace (invisible y un poco más arriba)
      animate={{ opacity: 1, y: 0 }} // Cómo se mantiene (visible y en su posición)
      exit={{ opacity: 0, scale: 0.9 }} // Cómo muere (se desvanece y se achica al filtrarse/borrarse)
      transition={{ type: 'spring', stiffness: 500, damping: 40 }} // Animación tipo resorte, muy fluida
      className="flex items-center p-4 group bg-white dark:bg-gray-800" // Asegura el fondo para evitar transparencias raras al salir
    >
      <input
        checked={completed}
        onChange={(event) => handleCompletedTodo({ event, id })}
        type="checkbox"
        className="h-6 w-6 rounded-full text-indigo-600 border-gray-300 dark:border-gray-600 focus:ring-indigo-500 dark:bg-gray-700 dark:checked:bg-indigo-500 transition duration-150 ease-in-out cursor-pointer"
      />
      <span
        className={`ml-4 flex-1 text-lg ${completed ? 'line-through text-gray-400 dark:text-gray-500' : 'text-gray-800 dark:text-gray-200'}`}
      >
        <input
          onChange={(event) => handleEditTextTodo({ event, id })}
          type="text"
          value={title}
          style={{ minWidth: `${Math.max(title.length)}ch` }}
        />
      </span>
    </motion.li>
  )
}
export default Todo
