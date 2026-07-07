import type { ToDo } from '../../types.d'
import { Filter_Todos } from '../const/FilterTodos'

type filterTodosTS = (typeof Filter_Todos)[keyof typeof Filter_Todos]

export const dictTodosAction: Record<filterTodosTS, (todos: ToDo[]) => ToDo[]> = {
  [Filter_Todos.NONE]: (todos) => todos,
  [Filter_Todos.ACTIVE]: (todos) => todos.filter((todo) => todo.completed === false),
  [Filter_Todos.COMPLETED]: (todos) => todos.filter((todo) => todo.completed === true)
}
