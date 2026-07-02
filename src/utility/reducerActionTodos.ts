import type { Action, AppState, ToDo } from '../../types'

export const reducer = (state: AppState, action: Action): AppState => {
  switch (action.type) {
    case 'ADD_TODO': {
      const newTodo: ToDo = {
        id: crypto.randomUUID(),
        title: action.payload.title,
        completed: false
      }
      const newTodos = [newTodo, ...state.todos]
      return {
        ...state,
        history: [...state.history, newTodos],
        todos: newTodos
      }
    }
    case 'TOGGLE_COMPLETE': {
      const newTodos = state.todos.map((todo) => {
        if (todo.id === action.payload.id) {
          return { ...todo, completed: action.payload.completed }
        }
        return todo
      })
      return {
        ...state,
        history: [...state.history, newTodos],
        todos: newTodos
      }
    }
    case 'DELETE_COMPLETED': {
      const newTodos = state.todos.filter((todo) => !todo.completed)
      return {
        ...state,
        history: [...state.history, newTodos],
        todos: newTodos
      }
    }
    case 'TOGGLE_ALL': {
      const newTodos = state.todos.map((todo) => ({
        ...todo,
        completed: action.payload.completed
      }))
      return {
        ...state,
        history: [...state.history, newTodos],
        todos: newTodos
      }
    }
    case 'UNDO': {
      if (state.history.length <= 1) {
        return state
      }
      const newHistory = state.history.slice(0, -1)
      const lastTodos = newHistory[newHistory.length - 1]
      return {
        ...state,
        history: newHistory,
        todos: lastTodos
      }
    }
    case 'TOGGLE_MARKED_ALL': {
      const updatedTodos = state.todos.map((todo) => ({
        ...todo,
        completed: action.payload.completed
      }))
      return {
        ...state,
        history: [...state.history, updatedTodos],
        todos: updatedTodos
      }
    }
    case 'EDIT_TODO_TEXT': {
      const editTodos = state.todos.map((todo) => {
        if (todo.id === action.payload.id) {
          return { ...todo, title: action.payload.title }
        }
        return todo
      })
      return {
        ...state,
        history: [...state.history, editTodos],
        todos: editTodos
      }
    }
    default:
      return state
  }
}
