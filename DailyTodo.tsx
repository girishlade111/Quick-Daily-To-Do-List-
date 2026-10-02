import { useState, useEffect } from 'react'
import { Button } from "/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "/components/ui/card"
import { Input } from "/components/ui/input"
import { Trash, Moon, Sun, GripVertical, History, X } from "lucide-react"

type Task = {
  id: string
  text: string
  deletedAt?: number
}

export default function DailyTodo() {
  const [tasks, setTasks] = useState<Task[]>([])
  const [deletedTasks, setDeletedTasks] = useState<Task[]>([])
  const [newTask, setNewTask] = useState('')
  const [darkMode, setDarkMode] = useState(false)
  const [draggedItem, setDraggedItem] = useState<Task | null>(null)
  const [showHistory, setShowHistory] = useState(false)

  // Load tasks and deleted tasks from localStorage on initial render
  useEffect(() => {
    const savedTasks = localStorage.getItem('daily-todo-tasks')
    if (savedTasks) {
      setTasks(JSON.parse(savedTasks))
    }
    
    const savedDeletedTasks = localStorage.getItem('daily-todo-deleted-tasks')
    if (savedDeletedTasks) {
      setDeletedTasks(JSON.parse(savedDeletedTasks))
    }
    
    const savedTheme = localStorage.getItem('daily-todo-theme')
    if (savedTheme) {
      setDarkMode(savedTheme === 'dark')
    }
  }, [])

  // Save tasks and deleted tasks to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('daily-todo-tasks', JSON.stringify(tasks))
    localStorage.setItem('daily-todo-deleted-tasks', JSON.stringify(deletedTasks))
  }, [tasks, deletedTasks])

  // Save theme preference to localStorage
  useEffect(() => {
    localStorage.setItem('daily-todo-theme', darkMode ? 'dark' : 'light')
  }, [darkMode])

  const addTask = () => {
    if (newTask.trim() === '') return
    
    const task: Task = {
      id: Date.now().toString(),
      text: newTask.trim()
    }
    
    setTasks([...tasks, task])
    setNewTask('')
  }

  const deleteTask = (id: string) => {
    const taskToDelete = tasks.find(task => task.id === id)
    if (!taskToDelete) return
    
    // Add deletion timestamp
    const deletedTask = {
      ...taskToDelete,
      deletedAt: Date.now()
    }
    
    setDeletedTasks([deletedTask, ...deletedTasks])
    setTasks(tasks.filter(task => task.id !== id))
  }

  const restoreTask = (id: string) => {
    const taskToRestore = deletedTasks.find(task => task.id === id)
    if (!taskToRestore) return
    
    // Remove from deleted tasks
    setDeletedTasks(deletedTasks.filter(task => task.id !== id))
    
    // Add back to active tasks (without deletedAt property)
    const { deletedAt, ...restoredTask } = taskToRestore
    setTasks([...tasks, restoredTask])
  }

  const permanentlyDeleteTask = (id: string) => {
    setDeletedTasks(deletedTasks.filter(task => task.id !== id))
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      addTask()
    }
  }

  const handleDragStart = (e: React.DragEvent<HTMLLIElement>, task: Task) => {
    setDraggedItem(task)
    e.dataTransfer.effectAllowed = 'move'
    e.dataTransfer.setData('text/html', '')
  }

  const handleDragOver = (e: React.DragEvent<HTMLLIElement>, index: number) => {
    e.preventDefault()
    if (!draggedItem) return
    
    const draggedIndex = tasks.findIndex(t => t.id === draggedItem.id)
    if (draggedIndex === index) return
    
    const newTasks = [...tasks]
    newTasks.splice(draggedIndex, 1)
    newTasks.splice(index, 0, draggedItem)
    
    setTasks(newTasks)
  }

  const handleDragEnd = () => {
    setDraggedItem(null)
  }

  const toggleTheme = () => {
    setDarkMode(!darkMode)
  }

  const toggleHistory = () => {
    setShowHistory(!showHistory)
  }

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleString()
  }

  return (
    <div className={`min-h-screen transition-colors duration-200 ${darkMode ? 'bg-gray-900 text-gray-100' : 'bg-white text-gray-900'}`}>
      <div className="container mx-auto px-4 py-8 max-w-md">
        <Card className={darkMode ? 'bg-gray-800 border-gray-700' : ''}>
          <CardHeader className="flex flex-row justify-between items-center">
            <CardTitle>Daily To-Do</CardTitle>
            <div className="flex gap-2">
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={toggleHistory}
                aria-label="Show history"
              >
                <History className="h-5 w-5" />
              </Button>
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={toggleTheme}
                aria-label="Toggle dark mode"
              >
                {darkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
              </Button>
            </div>
          </CardHeader>
          
          <CardContent>
            <div className="flex gap-2 mb-4">
              <Input
                type="text"
                value={newTask}
                onChange={(e) => setNewTask(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Add a new task..."
                className={darkMode ? 'bg-gray-700 border-gray-600' : ''}
              />
              <Button onClick={addTask}>Add</Button>
            </div>
            
            {tasks.length === 0 ? (
              <p className="text-center py-4 text-muted-foreground">
                No tasks yet. Add one above!
              </p>
            ) : (
              <ul className="space-y-2">
                {tasks.map((task, index) => (
                  <li
                    key={task.id}
                    draggable
                    onDragStart={(e) => handleDragStart(e, task)}
                    onDragOver={(e) => handleDragOver(e, index)}
                    onDragEnd={handleDragEnd}
                    className={`flex items-center gap-2 p-2 rounded-md ${darkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-100 hover:bg-gray-200'} cursor-move transition-colors`}
                  >
                    <GripVertical className="h-4 w-4 text-muted-foreground" />
                    <span className="flex-grow">{task.text}</span>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => deleteTask(task.id)}
                      className="text-red-500 hover:text-red-600"
                      aria-label="Delete task"
                    >
                      <Trash className="h-4 w-4" />
                    </Button>
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>

        {/* History Panel */}
        {showHistory && (
          <Card className={`mt-4 ${darkMode ? 'bg-gray-800 border-gray-700' : ''}`}>
            <CardHeader className="flex flex-row justify-between items-center">
              <CardTitle>Deleted Tasks</CardTitle>
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={toggleHistory}
                aria-label="Close history"
              >
                <X className="h-5 w-5" />
              </Button>
            </CardHeader>
            <CardContent>
              {deletedTasks.length === 0 ? (
                <p className="text-center py-4 text-muted-foreground">
                  No deleted tasks yet
                </p>
              ) : (
                <ul className="space-y-2">
                  {deletedTasks.map((task) => (
                    <li
                      key={`${task.id}-${task.deletedAt}`}
                      className={`flex flex-col gap-2 p-2 rounded-md ${darkMode ? 'bg-gray-700' : 'bg-gray-100'}`}
                    >
                      <div className="flex justify-between items-center">
                        <span>{task.text}</span>
                        <div className="flex gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => restoreTask(task.id)}
                            className="text-green-600 hover:text-green-700"
                          >
                            Restore
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => permanentlyDeleteTask(task.id)}
                            className="text-red-500 hover:text-red-600"
                          >
                            Delete
                          </Button>
                        </div>
                      </div>
                      <div className="text-xs text-muted-foreground">
                        Deleted: {task.deletedAt ? formatDate(task.deletedAt) : 'Unknown'}
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
