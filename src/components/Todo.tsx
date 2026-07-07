import {
  useState,
  useRef,
  useEffect,
  type ChangeEvent,
  type FC,
  type SubmitEvent,
  type KeyboardEvent,
  type MouseEvent
} from 'react'
import { motion } from 'motion/react'
import type { TodoCompleted, TodoId, TodoTitle } from '../../types.d'

interface Props {
  id: TodoId
  completed: TodoCompleted
  title: TodoTitle
  editingId: TodoId | null
  handleCompletedTodo: ({ event, id }: { event: ChangeEvent<HTMLInputElement>; id: TodoId }) => void
  handleFinishEdit: (id: TodoId, title: string) => void
  handleDeleteTodo: ({ id }: { id: TodoId }) => void
  handleContextMenu: ({ event, id }: { event: MouseEvent<HTMLElement>; id: TodoId }) => void
}

const Todo: FC<Props> = ({
  id,
  completed,
  title,
  editingId,
  handleCompletedTodo,
  handleFinishEdit,
  handleDeleteTodo,
  handleContextMenu
}) => {
  const isEditing = editingId === id
  const [editedTitle, setEditedTitle] = useState(title)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (isEditing) {
      inputRef.current?.focus()
      inputRef.current?.select()
    }
  }, [isEditing])

  const handleSubmit = (event: SubmitEvent<HTMLFormElement>): void => {
    event.preventDefault()
    handleFinishEdit(id, editedTitle)
  }

  const handleBlur = (): void => {
    handleFinishEdit(id, editedTitle)
  }

  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>): void => {
    if (event.key === 'Escape') {
      setEditedTitle(title) // Revertir cambios
      handleFinishEdit(id, title) // y salir del modo edición
    }
  }

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
      <div className="ml-4 flex-1">
        {isEditing ? (
          <form onSubmit={handleSubmit}>
            <input
              ref={inputRef}
              type="text"
              value={editedTitle}
              onChange={(e) => {
                setEditedTitle(e.target.value)
              }}
              onBlur={handleBlur}
              onKeyDown={handleKeyDown}
              className="w-full text-lg bg-transparent border-b-2 border-indigo-500 focus:outline-none text-gray-800 dark:text-gray-200"
            />
          </form>
        ) : (
          <label
            onContextMenu={(event) => {
              handleContextMenu({ event, id })
            }}
            className={`text-lg cursor-pointer ${completed ? 'line-through text-gray-400 dark:text-gray-500' : 'text-gray-800 dark:text-gray-200'}`}
          >
            {title}
          </label>
        )}
      </div>
      <button
        onClick={() => {
          handleDeleteTodo({ id })
        }}
        className="ml-4 text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
      >
        X
      </button>
    </motion.li>
  )
}
export default Todo
