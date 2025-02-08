"use client"

import type React from "react"
import { useTodo } from "../context/TodoContext"

const ProgressTracker: React.FC = () => {
  // Calculate progress statistics
  const { todos } = useTodo()
  const totalTasks = todos.length
  const completedTasks = todos.filter((todo) => todo.completed).length
  const progressPercentage = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0

  // SVG circle radius
  const circumference = 113

  return (
    <div className="flex items-center gap-3 bg-white dark:bg-zinc-900 rounded-full px-3 py-2 border border-gray-200 dark:border-zinc-800 w-full md:w-auto justify-center md:justify-start">
      <div className="relative w-9 h-9 md:w-11 md:h-11">
        <div className="absolute inset-0 rounded-full bg-gray-50 dark:bg-zinc-800" />
        
        <svg
          className="transform -rotate-90 w-9 h-9 md:w-11 md:h-11"
          viewBox="0 0 44 44"
        >
          {/* Background circle */}
          <circle
            cx="22"
            cy="22"
            r="18"
            className="fill-none stroke-gray-200 dark:stroke-zinc-700"
            strokeWidth="3.5"
          />
          {/* Progress circle */}
          <circle
            cx="22"
            cy="22"
            r="18"
            className={`fill-none ${
              progressPercentage === 100 
                ? 'stroke-green-500' 
                : 'stroke-blue-500'
            }`}
            strokeWidth="3.5"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={circumference - (progressPercentage * circumference) / 100}
            style={{ transition: 'stroke-dashoffset 0.5s ease-in-out' }}
          />
        </svg>
        
        <div className="absolute inset-0 flex items-center justify-center">
          <span className={`text-[10px] md:text-xs font-bold tracking-tighter ${
            progressPercentage === 100 
              ? 'text-green-600 dark:text-green-400' 
              : 'text-blue-600 dark:text-blue-400'
          }`}>
            {progressPercentage}%
          </span>
        </div>
      </div>

      <div className="flex flex-col">
        <span className="text-xs font-semibold text-gray-600 dark:text-gray-300">
          Completed
        </span>
        <span className="text-sm font-bold text-gray-900 dark:text-white">
          {completedTasks}/{totalTasks}
        </span>
      </div>
    </div>
  )
}

export default ProgressTracker

