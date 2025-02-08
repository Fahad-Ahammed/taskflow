"use client";

// Modal component for adding and editing todos
import React, { useState, useEffect } from "react";
import { useTodo, type Todo } from "../context/TodoContext";
import { IoAddCircleOutline } from "react-icons/io5";
import { MdClose, MdSave } from "react-icons/md";

type TodoFormModalProps = {
  isOpen: boolean;
  onClose: () => void;
  mode: "add" | "edit";
  todo?: Todo;
  onSave?: (id: string, updates: Partial<Todo>) => void;
}

const TodoFormModal: React.FC<TodoFormModalProps> = ({
  isOpen,
  onClose,
  mode = "add",
  todo,
  onSave,
}) => {
  // Track form input states
  const [name, setName] = useState("");
  const [completionDate, setCompletionDate] = useState("");
  const { addTodo } = useTodo();

  // Reset form when modal opens/closes or todo changes
  useEffect(() => {
    if (todo && mode === "edit") {
      setName(todo.name);
      setCompletionDate(todo.completionDate);
    } else {
      setName("");
      setCompletionDate("");
    }
  }, [todo, mode, isOpen]);

  // Handle form submission for both add and edit modes
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name && completionDate) {
      if (mode === "edit" && todo && onSave) {
        onSave(todo.id, { name, completionDate });
      } else {
        addTodo({ name, completionDate, completed: false });
      }
      onClose();
      setName("");
      setCompletionDate("");
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-md flex items-center justify-center z-50 p-4 transition-opacity duration-200 ease-out">
      <div className="w-full max-w-md bg-white dark:bg-zinc-900 rounded-xl shadow-[0_0_30px_10px_rgba(0,0,0,0.1)] dark:shadow-[0_0_30px_10px_rgba(0,0,0,0.3)] transition-all duration-200 transform translate-y-0">
        <div className="p-8 relative">
          <button
            type="button"
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full hover:bg-gray-100 dark:hover:bg-zinc-800 text-gray-500 dark:text-gray-400 transition-all duration-200"
            aria-label="Close modal"
          >
            <MdClose size={20} />
          </button>

          <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white pr-8">
            {mode === "edit" ? "Edit Todo" : "Add New Todo"}
          </h2>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-5">
              <div>
                <label
                  htmlFor="name"
                  className="block text-sm font-semibold mb-2 text-gray-700 dark:text-gray-200"
                >
                  Task Name
                </label>
                <input
                  type="text"
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-4 py-3 rounded-lg border border-gray-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all duration-200 placeholder-gray-400 dark:placeholder-gray-500"
                  placeholder="Enter your task"
                  required
                />
              </div>
              <div>
                <label
                  htmlFor="completionDate"
                  className="block text-sm font-semibold mb-2 text-gray-700 dark:text-gray-200"
                >
                  Completion Date
                </label>
                <input
                  type="date"
                  id="completionDate"
                  value={completionDate}
                  onChange={(e) => setCompletionDate(e.target.value)}
                  className="w-full px-4 py-3 rounded-lg border border-gray-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all duration-200"
                  required
                />
              </div>
            </div>
            <div className="flex justify-end mt-8">
              <button
                type="submit"
                className="group px-5 py-2.5 rounded-lg text-sm font-medium inline-flex items-center gap-2 bg-black dark:bg-white text-white dark:text-black hover:bg-zinc-900 dark:hover:bg-gray-100 transition-all duration-200 focus:ring-2 focus:ring-black/20 dark:focus:ring-white/20 outline-none shadow-lg shadow-black/10 dark:shadow-white/10 hover:shadow-black/20 dark:hover:shadow-white/20 active:scale-[0.98]"
              >
                {mode === "edit" ? (
                  <>
                    <span className="group-hover:rotate-12 transition-transform duration-200">
                      <MdSave size={18} />
                    </span>
                    Save Changes
                  </>
                ) : (
                  <>
                    <span className="group-hover:rotate-180 transition-transform duration-200">
                      <IoAddCircleOutline size={18} />
                    </span>
                    Add Task
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default TodoFormModal;
