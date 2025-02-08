"use client";

import type React from "react";
import { useTodo, type Todo } from "../context/TodoContext";
import { useState } from "react";
import TodoFormModal from "./TodoFormModal";
import { FiEdit2, FiCheck, FiTrash2 } from "react-icons/fi";
import { format } from "date-fns";
import { 
  DndContext, 
  DragEndEvent,
  DragStartEvent, 
  closestCenter,
  useDroppable,
  DragOverlay,
} from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

// Sortable todo item wrapper component
const SortableTodoItem: React.FC<{ todo: Todo; isDragging?: boolean }> = ({ todo, isDragging }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({ id: todo.id, disabled: todo.completed });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0 : 1,
    position: 'relative' as const,
  };

  return (
    <div ref={setNodeRef} style={style}>
      <TodoItem todo={todo} dragHandleProps={{ ...attributes, ...listeners }} />
    </div>
  );
};

// Individual todo item component
const TodoItem: React.FC<{ 
  todo: Todo, 
  dragHandleProps?: React.HTMLAttributes<HTMLDivElement> 
}> = ({ todo, dragHandleProps }) => {
  const { editTodo, deleteTodo } = useTodo();
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const isOverdue =
    new Date(todo.completionDate) < new Date() && !todo.completed;

  return (
    <>
      <div
        className={`mb-4 bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-lg shadow-sm transition-all duration-200 max-w-md hover:shadow-md ${
          todo.completed ? "opacity-70" : ""
        }`}
      >
        {/* Main Content - Drag Handle Area */}
        <div 
          {...(!todo.completed ? dragHandleProps : {})} 
          className={`p-4 ${!todo.completed ? "cursor-grab active:cursor-grabbing" : ""}`}
        >
          <div className="flex gap-3 min-w-0">
            <div
              className={`w-2 h-2 rounded-full mt-2.5 flex-shrink-0 ${
                todo.completed
                  ? "bg-green-500"
                  : isOverdue
                  ? "bg-red-500"
                  : "bg-blue-500"
              }`}
            />

            <div className="flex-1 min-w-0">
              <h3 className="text-base font-medium text-slate-900 dark:text-slate-100 leading-tight truncate mb-2">
                {todo.name}
              </h3>
              <div className="flex items-center text-xs">
                <span className="text-slate-500 dark:text-slate-400">Due:</span>
                <span className="ml-2 text-slate-600 dark:text-slate-300 font-medium">
                  {format(new Date(todo.completionDate), "MMM d, yyyy")}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Actions Footer - No Drag Handle */}
        <div className="border-t border-slate-200 dark:border-zinc-800 px-4 py-3 bg-slate-50 dark:bg-zinc-900/50">
          <div className="flex items-center justify-between">
            <span
              className={`text-xs font-medium ${
                todo.completed
                  ? "text-green-600 dark:text-green-400"
                  : isOverdue
                  ? "text-red-600 dark:text-red-400"
                  : "text-blue-600 dark:text-blue-400"
              }`}
            >
              {todo.completed
                ? "✓ Completed"
                : isOverdue
                ? "! Overdue"
                : "○ In Progress"}
            </span>

            <div className="flex items-center divide-x divide-slate-200 dark:divide-slate-700">
              {!todo.completed && (
                <div className="flex items-center gap-2 pr-2">
                  <button
                    onClick={() => editTodo(todo.id, { completed: true })}
                    className="p-2 rounded-full bg-green-100 dark:bg-green-900/30 hover:bg-green-200 dark:hover:bg-green-900/50 text-green-600 dark:text-green-400 transition-all duration-200"
                    aria-label="Complete todo"
                  >
                    <FiCheck size={16} />
                  </button>
                  <button
                    onClick={() => setIsEditModalOpen(true)}
                    className="p-2 rounded-full bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 text-slate-600 dark:text-slate-300 transition-all duration-200"
                    aria-label="Edit todo"
                  >
                    <FiEdit2 size={14} />
                  </button>
                </div>
              )}
              <div className="pl-2">
                <button
                  onClick={() => deleteTodo(todo.id)}
                  className="p-2 rounded-full bg-red-100 dark:bg-red-900/30 hover:bg-red-200 dark:hover:bg-red-900/50 text-red-600 dark:text-red-400 transition-all duration-200"
                  aria-label="Delete todo"
                >
                  <FiTrash2 size={16} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <TodoFormModal
        todo={todo}
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        onSave={editTodo}
        mode="edit"
      />
    </>
  );
};

// Droppable area for completed todos
const DroppableArea: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { setNodeRef } = useDroppable({
    id: 'done-list',
  });

  return (
    <div ref={setNodeRef} className="min-h-[100px]">
      {children}
    </div>
  );
};

// Main todo list component with drag and drop functionality
const TodoList: React.FC = () => {
  const { todos, searchTerm, filterStatus, editTodo } = useTodo();
  const [activeId, setActiveId] = useState<string | null>(null);

  // Filter todos based on search term and filter status
  const filteredTodos = todos.filter((todo) => {
    const matchesSearch = todo.name
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const today = new Date().toISOString().split("T")[0];
    const isToday = todo.completionDate === today;
    const isOverdue =
      new Date(todo.completionDate) < new Date() && !todo.completed;

    switch (filterStatus) {
      case "today":
        return matchesSearch && isToday;
      case "overdue":
        return matchesSearch && isOverdue;
      default:
        return matchesSearch;
    }
  });

  const uncompletedTodos = filteredTodos.filter((todo) => !todo.completed);
  const completedTodos = filteredTodos.filter((todo) => todo.completed);

  // Handle drag start event
  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event;
    setActiveId(active.id as string);
  };

  // Handle drag end event and mark todo as complete if dropped in done area
  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    
    if (over && over.id === 'done-list') {
      const draggedTodo = todos.find(todo => todo.id === active.id);
      if (draggedTodo && !draggedTodo.completed) {
        editTodo(draggedTodo.id, { completed: true });
      }
    }
    setActiveId(null);
  };

  return (
    <DndContext 
      collisionDetection={closestCenter} 
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="mt-10">
          <h2 className="text-xl font-bold mb-4 text-gray-800 dark:text-white">
            To-do
          </h2>
          <SortableContext items={uncompletedTodos.map(t => t.id)} strategy={verticalListSortingStrategy}>
            {uncompletedTodos.map((todo) => (
              <SortableTodoItem 
                key={todo.id} 
                todo={todo} 
                isDragging={activeId === todo.id}
              />
            ))}
          </SortableContext>
        </div>
        <div className="md:mt-10">
          <h2 className="text-xl font-bold mb-4 text-gray-800 dark:text-white">
            Done
          </h2>
          <DroppableArea>
            {completedTodos.map((todo) => (
              <TodoItem key={todo.id} todo={todo} />
            ))}
          </DroppableArea>
        </div>
      </div>

      <DragOverlay dropAnimation={{
        duration: 300,
        easing: "ease-in-out",
      }}>
        {activeId ? (
          <div >
            <TodoItem todo={todos.find(t => t.id === activeId)!} />
          </div>
        ) : null}
      </DragOverlay>
    </DndContext>
  );
};

export default TodoList;
