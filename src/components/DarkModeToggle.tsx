"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { HiSun, HiMoon } from "react-icons/hi"

const DarkModeToggle: React.FC = () => {
  const [darkMode, setDarkMode] = useState(true)

  // Initialize dark mode on component mount
  useEffect(() => {
    document.documentElement.classList.toggle("dark", true)
  }, [])

  // Toggle between light and dark mode
  const toggleDarkMode = () => {
    const newDarkMode = !darkMode
    setDarkMode(newDarkMode)
    document.documentElement.classList.toggle("dark", newDarkMode)
  }

  return (
    <button
      onClick={toggleDarkMode}
      className="p-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
      aria-label="Toggle dark mode"
    >
      {darkMode ? <HiSun size={20}/> : <HiMoon size={20} />}
    </button>
  )
}

export default DarkModeToggle

