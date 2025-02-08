"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"

export type Todo = {
  id: string
  name: string
  completionDate: string
  completed: boolean
}

type TodoContextType = {
  todos: Todo[]
  addTodo: (todo: Omit<Todo, "id">) => void
  editTodo: (id: string, todo: Partial<Todo>) => void
  deleteTodo: (id: string) => void
  searchTerm: string
  setSearchTerm: (term: string) => void
  filterStatus: "all" | "today" | "overdue"
  setFilterStatus: (status: "all" | "today" | "overdue") => void
}

/** Context for managing todo items */
const TodoContext = createContext<TodoContextType | undefined>(undefined)

/** Provider component for todo management */
export const TodoProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {

  const [mounted, setMounted] = useState(false);
  const [todos, setTodos] = useState<Todo[]>(() => {
    if (typeof window !== "undefined") {
      const storedTodos = localStorage.getItem("todos")
      return storedTodos ? JSON.parse(storedTodos) : []
    }
    return []
  })
  const [searchTerm, setSearchTerm] = useState("")
  const [filterStatus, setFilterStatus] = useState<"all" | "today" | "overdue">("all")

  
  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (mounted) {
      localStorage.setItem("todos", JSON.stringify(todos))
    }
  }, [todos, mounted])



  const addTodo = (todo: Omit<Todo, "id">) => {
    const newTodo = { ...todo, id: Date.now().toString() }
    setTodos((prevTodos) => [...prevTodos, newTodo])
  }

  const editTodo = (id: string, updatedTodo: Partial<Todo>) => {
    setTodos((prevTodos) => prevTodos.map((todo) => (todo.id === id ? { ...todo, ...updatedTodo } : todo)))
  }

  const deleteTodo = (id: string) => {
    setTodos((prevTodos) => prevTodos.filter((todo) => todo.id !== id))
  }
  
  if (!mounted) return null

  return (
    <TodoContext.Provider
      value={{ todos, addTodo, editTodo, deleteTodo, searchTerm, setSearchTerm, filterStatus, setFilterStatus }}
    >
      {children}
    </TodoContext.Provider>
  )
}

/** Hook for accessing todo context and operations */
export const useTodo = () => {
  const context = useContext(TodoContext)
  if (context === undefined) {
    throw new Error("useTodo must be used within a TodoProvider")
  }
  return context
}

