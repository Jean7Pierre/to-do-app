interface ToDo {
  id: string
  title: string
  completed: boolean
}

export type TodoId = ToDo['id']
export type TodoTitle = ToDo['title']
export type TodoCompleted = ToDo['completed']

export type ListOfTodos = ToDo[]

export interface AppState {
  todos: ToDo[]
  history: ToDo[][]
}

export type Action =
  | { type: 'ADD_TODO'; payload: { title: string } }
  | { type: 'TOGGLE_COMPLETE'; payload: { id: string; completed: boolean } }
  | { type: 'DELETE_COMPLETED' }
  | { type: 'TOGGLE_ALL'; payload: { completed: boolean } }
  | { type: 'UNDO' }
  | { type: 'TOGGLE_MARKED_ALL'; payload: { completed: boolean } }
  | { type: 'EDIT_TODO_TEXT'; payload: { id: string; title: string } }
