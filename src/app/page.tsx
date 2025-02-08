"use client";

import { useState } from "react";
import { IoMdAdd } from "react-icons/io";
import TodoList from "../components/TodoList";
import TodoFormModal from "../components/TodoFormModal";
import SearchFilter from "../components/SearchFilter";
import ProgressTracker from "../components/ProgressTracker";
import DarkModeToggle from "../components/DarkModeToggle";

export default function Home() {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  return (
    <main className="min-h-screen bg-[#f5f7fa] dark:bg-black">
      <div className="max-w-[1300px] mx-auto w-[90%] py-4 md:py-6 space-y-3">
        {/* App Header: Logo and Dark Mode Toggle */}
        <div className="flex items-center justify-between mb-10">
            <div className="flex items-center gap-2">
            <svg 
              className="w-8 h-8 text-indigo-600 dark:text-indigo-400"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
            </svg>
            <div>
              <h1 className="text-xl md:text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-400 dark:to-purple-400 bg-clip-text text-transparent">
              TaskFlow
              </h1>
              <p className="text-sm text-gray-600 dark:text-gray-400">Organize your day</p>
            </div>
            </div>
          <DarkModeToggle />
        </div>

        {/* Task Management Controls */}
        <div className="space-y-3 md:space-y-0 md:flex md:items-center md:justify-between">
          {/* New Task Button */}
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="group w-full md:w-auto inline-flex items-center justify-center px-5 py-2.5 bg-black dark:bg-white text-white dark:text-black rounded-lg text-sm font-medium transition-all hover:bg-zinc-900 dark:hover:bg-gray-100 active:scale-[0.98] shadow-lg shadow-black/10 dark:shadow-white/10 hover:shadow-black/20 dark:hover:shadow-white/20"
          >
            <span className="mr-2 transition-transform group-hover:rotate-90">
              <IoMdAdd size={18} />
            </span>
            New Task
          </button>

          {/* Task Management Tools: Search and Progress Tracking */}
          <div className="flex flex-col md:flex-row items-stretch md:items-center gap-3">
            <SearchFilter />
            <ProgressTracker />
          </div>
        </div>

        {/* Main Todo List and Modal */}
        <TodoList />
        <TodoFormModal
          isOpen={isAddModalOpen}
          onClose={() => setIsAddModalOpen(false)}
          mode="add"
        />
      </div>
    </main>
  );
}
