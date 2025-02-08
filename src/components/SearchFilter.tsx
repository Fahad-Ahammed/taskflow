"use client";

import type React from "react";
import { FiSearch } from "react-icons/fi";
import { useTodo } from "../context/TodoContext";

// Search and filter component for todo list
const SearchFilter: React.FC = () => {
  // Context hooks for search and filter functionality
  const { searchTerm, setSearchTerm, filterStatus, setFilterStatus } =
    useTodo();

  return (
    <div className="flex flex-col md:flex-row gap-3 w-full md:w-auto">
      {/* Search input with icon */}
      <div className="relative flex-1 md:flex-initial">
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
          <FiSearch size={18} />
        </span>
        <input
          type="text"
          placeholder="Search..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full md:w-[200px] pl-10 pr-4 py-2 rounded-full border border-gray-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-gray-900 dark:text-gray-100 focus:outline-none focus:border-blue-500 transition-colors text-sm"
        />
      </div>

      {/* Filter dropdown for task status */}
      <div className="relative">
        <select
          value={filterStatus}
          onChange={(e) =>
            setFilterStatus(e.target.value as "all" | "today" | "overdue")
          }
          className="w-full md:w-auto appearance-none pl-4 pr-10 py-2 rounded-full border border-gray-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-gray-900 dark:text-gray-100 focus:outline-none focus:border-blue-500 transition-colors text-sm"
        >
          <option value="all">All Tasks</option>
          <option value="today">Due Today</option>
          <option value="overdue">Overdue</option>
        </select>
        <div className="absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none">
          <svg
            className="w-4 h-4 text-gray-500 dark:text-gray-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </div>
      </div>
    </div>
  );
};

export default SearchFilter;
