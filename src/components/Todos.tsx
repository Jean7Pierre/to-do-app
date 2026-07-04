import { createPortal } from 'react-dom'
import { useState, type ChangeEvent, type FC } from 'react'
import { type ListOfTodos, type TodoId } from '../../types'
import { AnimatePresence } from 'motion/react'
import Todo from './Todo'

interface Props {
  todos: ListOfTodos
  handleCompletedTodo: ({ event, id }: { event: ChangeEvent<HTMLInputElement>; id: TodoId }) => void
  handleEditTextTodo: ({ id, title }: { id: TodoId; title: string }) => void
  handleDeleteTodo: ({ id }: { id: TodoId }) => void
}

const Todos: FC<Props> = ({ todos, handleDeleteTodo, handleCompletedTodo, handleEditTextTodo }) => {
  // Estado para controlar la posición y visibilidad del menú contextual
  const [menuConfig, setMenuConfig] = useState({
    isVisible: false,
    x: 0,
    y: 0,
    todoId: null as TodoId | null
  })

  // Estado para controlar qué TODO se está editando
  const [editingId, setEditingId] = useState<TodoId | null>(null)

  const handleContextMenu = ({ event, id }: { event: MouseEvent; id: TodoId }) => {
    event.preventDefault() // Evita el menú nativo del navegador

    // Guardamos la posición exacta del cursor en píxeles
    setMenuConfig({
      isVisible: true,
      x: event.clientX,
      y: event.clientY,
      todoId: id
    })
  }

  const cerrarMenu = () => {
    setMenuConfig({ ...menuConfig, isVisible: false })
  }

  const handleEditar = () => {
    if (menuConfig.todoId) {
      setEditingId(menuConfig.todoId)
    }
    cerrarMenu()
  }

  const handleFinishEdit = (id: TodoId, title: string): void => {
    handleEditTextTodo({ id, title })
    setEditingId(null)
  }
  return (
    <div className="bg-white dark:bg-gray-800 shadow-lg rounded-xl h-96 overflow-y-auto" onClick={cerrarMenu}>
      <ul className="divide-y divide-gray-200 dark:divide-gray-700">
        {/* 1. AnimatePresence detecta cuándo se eliminan o filtran elementos */}
        <AnimatePresence mode="popLayout">
          {todos.map((todo) => (
            <Todo
              key={todo.id}
              id={todo.id}
              title={todo.title}
              completed={todo.completed}
              editingId={editingId}
              handleFinishEdit={handleFinishEdit}
              handleCompletedTodo={handleCompletedTodo}
              handleDeleteTodo={handleDeleteTodo}
              handleContextMenu={handleContextMenu}
            />
          ))}
        </AnimatePresence>
      </ul>

      {/* Renderizamos el menú usando un Portal al final del body */}
      {menuConfig.isVisible && <MenuContextual x={menuConfig.x} y={menuConfig.y} onEditar={handleEditar} />}

      {/* Si está vacío, el texto se inyecta directamente debajo en el mismo contenedor */}
      {todos.length === 0 && (
        <div className="flex h-full items-center justify-center p-4">
          <p className="text-gray-500 dark:text-gray-400">No hay tareas por aquí.</p>
        </div>
      )}
    </div>
  )
}

// Componente Menú que viaja al final del HTML mediante el Portal
function MenuContextual({ x, y, onEditar }: { x: number; y: number; onEditar: () => void }) {
  return createPortal(
    <div
      style={{
        position: 'fixed',
        top: `${y}px`,
        left: `${x}px`,
        backgroundColor: 'white',
        border: '1px solid #ccc',
        boxShadow: '2px 2px 10px rgba(0,0,0,0.15)',
        zIndex: 9999,
        borderRadius: '4px',
        padding: '5px 0'
      }}
    >
      <button
        onClick={(e) => {
          e.stopPropagation()
          onEditar()
        }}
        style={{
          background: 'none',
          border: 'none',
          padding: '8px 16px',
          cursor: 'pointer',
          width: '100%',
          textAlign: 'left',
          fontSize: '14px'
        }}
      >
        ✏️ Editar todo
      </button>
    </div>,
    document.body // Destino del portal
  )
}

export default Todos
