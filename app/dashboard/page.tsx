'use client'

import { useState } from 'react'

interface Task {
  id: string
  title: string
  subtitle?: string
  time: string
  icon: string
  color: string
  completed: boolean
  date?: string
}

export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState('todo')
  const [showAddTask, setShowAddTask] = useState(false)
  const [tasks, setTasks] = useState<Task[]>([])
  const [newTask, setNewTask] = useState({
    title: '',
    notes: '',
    date: '',
    time: ''
  })
  const [showDatePicker, setShowDatePicker] = useState(false)
  const [showTimePicker, setShowTimePicker] = useState(false)
  const [showCompleted, setShowCompleted] = useState(false)
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth())
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear())
  const [selectedDay, setSelectedDay] = useState<number | null>(null)
  const [historyFilter, setHistoryFilter] = useState('Mensal')

  const handleAddTask = () => {
    if (!newTask.title.trim()) return

    const task: Task = {
      id: Date.now().toString(),
      title: newTask.title,
      subtitle: newTask.notes || undefined,
      time: newTask.time || '24h',
      icon: '📝', // Default icon
      color: 'bg-blue-400', // Default color
      completed: false,
      date: newTask.date || undefined
    }

    setTasks([...tasks, task])
    setNewTask({ title: '', notes: '', date: '', time: '' })
    setShowAddTask(false)
  }

  return (
    <div 
      className='min-h-screen relative overflow-hidden'
      style={{
        backgroundImage: 'url(/space-background-new.png)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
      }}
    >
      {/* Gradient overlay for better readability */}
      <div 
        className='absolute inset-0'
        style={{
          background: 'linear-gradient(135deg, rgba(27, 3, 55, 0.45) 0%, rgba(18, 3, 38, 0.55) 100%)',
        }}
      />

      {/* Add Task Modal */}
      {showAddTask && (
        <div 
          className='fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4'
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              setShowAddTask(false)
              setShowDatePicker(false)
              setShowTimePicker(false)
              setNewTask({ title: '', notes: '', date: '', time: '' })
            }
          }}
        >
          <div 
            className='w-full max-w-md bg-gradient-to-b from-purple-900/95 to-indigo-900/95 backdrop-blur-md rounded-3xl p-6 space-y-6 shadow-2xl border border-white/20'
            onClick={(e) => e.stopPropagation()}
          >
            <div className='flex items-center justify-between'>
              <h2 className='text-white text-xl font-bold'>Add the to-do list</h2>
              <div className='flex space-x-2'>
                <button className='w-8 h-8 bg-white/20 rounded-full flex items-center justify-center'>
                  <svg className='w-4 h-4 text-white' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                    <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z' />
                  </svg>
                </button>
                <button
                  onClick={() => {
                    setShowAddTask(false)
                    setNewTask({ title: '', notes: '', date: '', time: '' })
                  }}
                  className='w-8 h-8 bg-white/20 rounded-full flex items-center justify-center hover:bg-white/30 transition-all'
                >
                  <svg className='w-4 h-4 text-white' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                    <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M6 18L18 6M6 6l12 12' />
                  </svg>
                </button>
              </div>
            </div>

            {/* Task Name Input */}
            <div>
              <input
                type="text"
                placeholder="Insert the name of your new task here..."
                value={newTask.title}
                onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                className='w-full bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl px-4 py-3 text-white placeholder:text-white/50 focus:outline-none focus:ring-2 focus:ring-cyan-400/50 transition-all'
              />
            </div>

            {/* Date and Time Row */}
            <div className='flex space-x-3'>
              {/* Date Picker */}
              <div className='flex-1 relative'>
                <button
                  onClick={() => setShowDatePicker(!showDatePicker)}
                  className='w-full bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl px-4 py-3 flex items-center space-x-2 hover:bg-white/20 transition-all'
                >
                  <svg className='w-5 h-5 text-cyan-400' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                    <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z' />
                  </svg>
                  <span className='text-white text-sm'>
                    {newTask.date || 'Select Date'}
                  </span>
                </button>
                
                {showDatePicker && (
                  <div className='absolute top-full mt-2 left-0 w-80 max-h-96 overflow-y-auto bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 p-4 shadow-xl z-10'>
                    {/* Calendar Header */}
                    <div className='flex items-center justify-between mb-4'>
                      <button 
                        onClick={() => {
                          if (currentMonth === 0) {
                            setCurrentMonth(11)
                            setCurrentYear(currentYear - 1)
                          } else {
                            setCurrentMonth(currentMonth - 1)
                          }
                        }}
                        className='p-1 hover:bg-white/10 rounded-lg transition-all'
                      >
                        <svg className='w-5 h-5 text-white' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                          <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M15 19l-7-7 7-7' />
                        </svg>
                      </button>
                      <h3 className='text-white font-semibold text-lg'>
                        {new Date(currentYear, currentMonth).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                      </h3>
                      <button 
                        onClick={() => {
                          if (currentMonth === 11) {
                            setCurrentMonth(0)
                            setCurrentYear(currentYear + 1)
                          } else {
                            setCurrentMonth(currentMonth + 1)
                          }
                        }}
                        className='p-1 hover:bg-white/10 rounded-lg transition-all'
                      >
                        <svg className='w-5 h-5 text-white' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                          <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M9 5l7 7-7 7' />
                        </svg>
                      </button>
                    </div>
                    
                    {/* Days of Week */}
                    <div className='grid grid-cols-7 gap-1 mb-2'>
                      {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((day, index) => (
                        <div key={index} className='text-center text-white/60 text-sm font-medium py-2'>
                          {day}
                        </div>
                      ))}
                    </div>
                    
                    {/* Calendar Days */}
                    <div className='grid grid-cols-7 gap-1'>
                      {(() => {
                        const firstDay = new Date(currentYear, currentMonth, 1).getDay()
                        const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate()
                        const daysInPrevMonth = new Date(currentYear, currentMonth, 0).getDate()
                        const days = []
                        
                        // Previous month days
                        for (let i = firstDay - 1; i >= 0; i--) {
                          days.push(
                            <button key={`prev-${daysInPrevMonth - i}`} className='h-10 text-white/30 text-sm hover:bg-white/5 rounded-lg transition-all'>
                              {daysInPrevMonth - i}
                            </button>
                          )
                        }
                        
                        // Current month days
                        for (let day = 1; day <= daysInMonth; day++) {
                          const isToday = new Date().getDate() === day && new Date().getMonth() === currentMonth && new Date().getFullYear() === currentYear
                          const isSelected = selectedDay === day
                          
                          days.push(
                            <button
                              key={day}
                              onClick={() => setSelectedDay(day)}
                              className={`h-10 text-sm rounded-lg transition-all font-medium ${
                                isSelected
                                  ? 'text-white shadow-lg'
                                  : isToday
                                  ? 'bg-white/20 text-white'
                                  : 'text-white/80 hover:bg-white/10'
                              }`}
                              style={isSelected ? {
                                background: 'linear-gradient(135deg, #5FB6D9 0%, #417FA6 50%, #94D6E8 100%)'
                              } : {}}
                            >
                              {day}
                            </button>
                          )
                        }
                        
                        // Next month days to fill the grid
                        const totalCells = Math.ceil((firstDay + daysInMonth) / 7) * 7
                        const remainingCells = totalCells - (firstDay + daysInMonth)
                        for (let day = 1; day <= remainingCells; day++) {
                          days.push(
                            <button key={`next-${day}`} className='h-10 text-white/30 text-sm hover:bg-white/5 rounded-lg transition-all'>
                              {day}
                            </button>
                          )
                        }
                        
                        return days
                      })()}
                    </div>
                    
                    {/* Action Buttons */}
                    <div className='flex justify-between mt-4 pt-4 border-t border-white/20'>
                      <button
                        onClick={() => {
                          setShowDatePicker(false)
                          setSelectedDay(null)
                        }}
                        className='px-4 py-2 text-white/70 hover:text-white transition-all'
                      >
                        Cancel
                      </button>
                      <button
                        onClick={() => {
                          if (selectedDay) {
                            const selectedDate = `${currentYear}-${(currentMonth + 1).toString().padStart(2, '0')}-${selectedDay.toString().padStart(2, '0')}`
                            setNewTask({ ...newTask, date: selectedDate })
                            setShowDatePicker(false)
                            setSelectedDay(null)
                          }
                        }}
                        disabled={!selectedDay}
                        className={`px-6 py-2 rounded-xl font-medium transition-all ${
                          selectedDay 
                            ? 'text-white shadow-lg' 
                            : 'text-white/50 cursor-not-allowed'
                        }`}
                        style={selectedDay ? {
                          background: 'linear-gradient(135deg, #5FB6D9 0%, #417FA6 50%, #94D6E8 100%)'
                        } : {}}
                      >
                        OK
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Time Input */}
              <div className='flex-1'>
                <div className='bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl px-4 py-3 flex items-center space-x-2'>
                  <svg className='w-5 h-5 text-cyan-400' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                    <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z' />
                  </svg>
                  <div className='flex items-center space-x-1 flex-1'>
                    <input
                      type="text"
                      value={newTask.time.split(':')[0] || ''}
                      onChange={(e) => {
                        const value = e.target.value.replace(/\D/g, '').slice(0, 2);
                        const currentMinutes = newTask.time.split(':')[1] || '';
                        setNewTask({ ...newTask, time: `${value}:${currentMinutes}` });
                      }}
                      placeholder="00"
                      maxLength={2}
                      className='w-12 bg-transparent text-white text-sm text-center focus:outline-none placeholder:text-white/50'
                    />
                    <span className='text-white font-bold'>:</span>
                    <input
                      type="text"
                      value={newTask.time.split(':')[1] || ''}
                      onChange={(e) => {
                        const value = e.target.value.replace(/\D/g, '').slice(0, 2);
                        const currentHours = newTask.time.split(':')[0] || '';
                        setNewTask({ ...newTask, time: `${currentHours}:${value}` });
                      }}
                      placeholder="00"
                      maxLength={2}
                      className='w-12 bg-transparent text-white text-sm text-center focus:outline-none placeholder:text-white/50'
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Notes Input */}
            <div>
              <textarea
                placeholder="Enter notes for your new task here..."
                value={newTask.notes}
                onChange={(e) => setNewTask({ ...newTask, notes: e.target.value })}
                rows={3}
                className='w-full bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl px-4 py-3 text-white placeholder:text-white/50 focus:outline-none focus:ring-2 focus:ring-cyan-400/50 resize-none transition-all'
              />
            </div>

            {/* Add Button */}
            <button
              onClick={handleAddTask}
              disabled={!newTask.title.trim()}
              className='w-full bg-gradient-to-r from-cyan-500 to-blue-500 py-4 rounded-2xl text-white font-semibold text-lg hover:from-cyan-600 hover:to-blue-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg'
            >
              Add
            </button>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className='relative z-10 min-h-screen flex flex-col'>
        {/* Header */}
        <div className='flex items-center justify-between p-4 pt-8'>
          <h1 className='text-white text-2xl font-bold'>Home</h1>
          <button 
            onClick={() => setShowAddTask(true)}
            className='w-10 h-10 backdrop-blur-md rounded-full flex items-center justify-center border border-white/30 hover:shadow-lg transition-all'
            style={{
              background: 'linear-gradient(135deg, #5FB6D9 0%, #417FA6 50%, #94D6E8 100%)'
            }}
          >
            <svg className='w-6 h-6 text-white' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
              <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M12 6v6m0 0v6m0-6h6m-6 0H6' />
            </svg>
          </button>
        </div>

        {/* Navigation Tabs */}
        <div className='px-4 mb-6'>
          <div className='flex bg-white/10 backdrop-blur-md rounded-2xl p-1 border border-white/20'>
            <button
              onClick={() => setActiveTab('todo')}
              className={`flex-1 py-3 px-4 rounded-xl text-sm font-medium transition-all ${
                activeTab === 'todo'
                  ? 'text-white shadow-lg'
                  : 'text-white/70 hover:text-white'
              }`}
              style={activeTab === 'todo' ? {
                background: 'linear-gradient(135deg, #5FB6D9 0%, #417FA6 50%, #94D6E8 100%)'
              } : {}}
            >
              To-Do List
            </button>
            <button
              onClick={() => setActiveTab('routine')}
              className={`flex-1 py-3 px-4 rounded-xl text-sm font-medium transition-all ${
                activeTab === 'routine'
                  ? 'text-white shadow-lg'
                  : 'text-white/70 hover:text-white'
              }`}
              style={activeTab === 'routine' ? {
                background: 'linear-gradient(135deg, #5FB6D9 0%, #417FA6 50%, #94D6E8 100%)'
              } : {}}
            >
              Routine
            </button>
            <button
              onClick={() => setActiveTab('progress')}
              className={`flex-1 py-3 px-4 rounded-xl text-sm font-medium transition-all ${
                activeTab === 'progress'
                  ? 'text-white shadow-lg'
                  : 'text-white/70 hover:text-white'
              }`}
              style={activeTab === 'progress' ? {
                background: 'linear-gradient(135deg, #5FB6D9 0%, #417FA6 50%, #94D6E8 100%)'
              } : {}}
            >
              Graphics/Progress
            </button>
          </div>
        </div>

        {/* Content Area */}
        <div className='flex-1 px-4 pb-20'>
          {activeTab === 'todo' && (
            <div className='space-y-6'>
              {/* TODAY Section */}
              <div>
                <h2 className='text-white text-lg font-bold mb-4'>TODAY</h2>
                <div className='space-y-3'>
                  {tasks.filter(task => !task.completed && !task.date).map((task) => (
                    <div key={task.id} className='bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/20 flex items-center justify-between'>
                      <div className='flex items-center space-x-3'>
                        <div className={`w-6 h-6 ${task.color} rounded-full flex items-center justify-center`}>
                          <span className='text-white text-xs'>{task.icon}</span>
                        </div>
                        <div>
                          <p className='text-white font-medium'>{task.title}</p>
                          {task.subtitle && <p className='text-white/70 text-sm'>{task.subtitle}</p>}
                        </div>
                      </div>
                      <div className='flex items-center space-x-2'>
                        <div className='text-white/70 text-sm'>{task.time}</div>
                        <button
                          onClick={() => {
                            setTasks(tasks.map(t => 
                              t.id === task.id ? { ...t, completed: true } : t
                            ))
                          }}
                          className='w-6 h-6 border-2 border-white/30 rounded-full hover:bg-green-500 hover:border-green-500 transition-all'
                        />
                      </div>
                    </div>
                  ))}
                  
                  {tasks.filter(task => !task.completed && !task.date).length === 0 && (
                    <div className='text-center py-8'>
                      <p className='text-white/50'>No tasks for today. Click + to add a new task!</p>
                    </div>
                  )}

                  <div className='bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/20 hidden'>
                    <div className='flex items-center space-x-3'>
                      <div className='w-6 h-6 bg-orange-400 rounded-full flex items-center justify-center'>
                        <span className='text-white text-xs'>�️</span>
                      </div>
                      <p className='text-white font-medium'>Make dinner</p>
                    </div>
                    <div className='text-white/70 text-sm'>18:30p</div>
                  </div>
                </div>
              </div>

              {/* Future Dates Section */}
              {Object.keys(
                tasks
                  .filter(task => !task.completed && task.date)
                  .reduce((acc, task) => {
                    const date = task.date || ''
                    if (!acc[date]) acc[date] = []
                    acc[date].push(task)
                    return acc
                  }, {} as Record<string, Task[]>)
              ).map(date => (
                <div key={date}>
                  <h2 className='text-white text-lg font-bold mb-4'>{date}</h2>
                  <div className='space-y-3'>
                    {tasks.filter(task => !task.completed && task.date === date).map((task) => (
                      <div key={task.id} className='bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/20 flex items-center justify-between'>
                        <div className='flex items-center space-x-3'>
                          <div className={`w-6 h-6 ${task.color} rounded-full flex items-center justify-center`}>
                            <span className='text-white text-xs'>{task.icon}</span>
                          </div>
                          <div>
                            <p className='text-white font-medium'>{task.title}</p>
                            {task.subtitle && <p className='text-white/70 text-sm'>{task.subtitle}</p>}
                          </div>
                        </div>
                        <div className='flex items-center space-x-2'>
                          <div className='text-white/70 text-sm'>{task.time}</div>
                          <button
                            onClick={() => {
                              setTasks(tasks.map(t => 
                                t.id === task.id ? { ...t, completed: true } : t
                              ))
                            }}
                            className='w-6 h-6 border-2 border-white/30 rounded-full hover:bg-green-500 hover:border-green-500 transition-all'
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}

              {/* COMPLETED TODAY Section */}
              <div>
                <div 
                  className='flex items-center cursor-pointer mb-4'
                  onClick={() => setShowCompleted(!showCompleted)}
                >
                  <h2 className='text-white text-lg font-bold mr-2'>COMPLETED TODAY</h2>
                  <svg 
                    className={`w-5 h-5 text-white transform transition-transform ${
                      showCompleted ? 'rotate-180' : ''
                    }`} 
                    fill='none' 
                    stroke='currentColor' 
                    viewBox='0 0 24 24'
                  >
                    <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M19 9l-7 7-7-7' />
                  </svg>
                </div>
                
                {showCompleted && (
                  <div className='space-y-3'>
                    {tasks.filter(task => task.completed).length > 0 ? (
                      tasks.filter(task => task.completed).map((task) => (
                        <div key={task.id} className='bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/20 flex items-center space-x-3 opacity-70'>
                          <div className='w-6 h-6 bg-green-500 rounded-full flex items-center justify-center'>
                            <svg className='w-4 h-4 text-white' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                              <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M5 13l4 4L19 7' />
                            </svg>
                          </div>
                          <p className='text-white font-medium line-through'>{task.title}</p>
                        </div>
                      ))
                    ) : (
                      <div className='text-center py-4'>
                        <p className='text-white/50'>No completed tasks yet.</p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === 'routine' && (
            <div className='flex items-center justify-center h-64'>
              <p className='text-white/70 text-lg'>Routine content will be styled later</p>
            </div>
          )}

          {activeTab === 'progress' && (
            <div className='space-y-6'>
              {/* 1. Progresso Diário de Tarefas - Donut Chart Gamificado */}
              <div className='bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20'>
                <h3 className='text-white font-semibold mb-6'>Progresso Diário</h3>
                <div className='flex justify-center'>
                  <div className='relative w-40 h-40'>
                    {/* Donut Chart */}
                    <svg className='w-40 h-40 transform -rotate-90' viewBox='0 0 160 160'>
                      {/* Inner background circle */}
                      <circle
                        cx='80'
                        cy='80'
                        r='60'
                        fill='#1E0C3A'
                      />
                      {/* Outer track (not completed) */}
                      <circle
                        cx='80'
                        cy='80'
                        r='70'
                        stroke='#5D5A72'
                        strokeWidth='20'
                        fill='transparent'
                        opacity='0.6'
                      />
                      {/* Progress circle */}
                      <circle
                        cx='80'
                        cy='80'
                        r='70'
                        stroke='url(#dailyProgressGradient)'
                        strokeWidth='20'
                        fill='transparent'
                        strokeDasharray={`${2 * Math.PI * 70}`}
                        strokeDashoffset={`${2 * Math.PI * 70 * (1 - (() => {
                          const todayTasks = tasks.filter(task => {
                            if (!task.date) return !task.date;
                            const taskDate = new Date(task.date);
                            const today = new Date();
                            return taskDate.toDateString() === today.toDateString();
                          });
                          return todayTasks.length > 0 ? todayTasks.filter(t => t.completed).length / todayTasks.length : 0;
                        })())}`}
                        className='transition-all duration-1000 drop-shadow-lg'
                        style={{
                          filter: (() => {
                            const todayTasks = tasks.filter(task => {
                              if (!task.date) return !task.date;
                              const taskDate = new Date(task.date);
                              const today = new Date();
                              return taskDate.toDateString() === today.toDateString();
                            });
                            const completionRate = todayTasks.length > 0 ? todayTasks.filter(t => t.completed).length / todayTasks.length : 0;
                            return completionRate === 1 ? 'drop-shadow(0 0 20px #46B9FF) brightness(1.3)' : 'none';
                          })()
                        }}
                      />
                      {/* Gradient definition */}
                      <defs>
                        <linearGradient id='dailyProgressGradient' x1='0%' y1='0%' x2='100%' y2='0%'>
                          <stop offset='0%' stopColor='#46B9FF' />
                          <stop offset='100%' stopColor='#A07CFF' />
                        </linearGradient>
                      </defs>
                    </svg>
                    {/* Center text */}
                    <div className='absolute inset-0 flex items-center justify-center'>
                      <div className='text-center'>
                        <div className='text-3xl font-bold text-white'>
                          {(() => {
                            const todayTasks = tasks.filter(task => {
                              if (!task.date) return !task.date;
                              const taskDate = new Date(task.date);
                              const today = new Date();
                              return taskDate.toDateString() === today.toDateString();
                            });
                            return todayTasks.length > 0 ? Math.round((todayTasks.filter(t => t.completed).length / todayTasks.length) * 100) : 0;
                          })()}%
                        </div>
                        <div className='text-white/70 text-xs'>Concluído</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* 2. Tarefas Concluídas x Pendentes do Dia - Barras Horizontais */}
              <div className='bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20'>
                <h3 className='text-white font-semibold mb-6'>Tarefas de Hoje</h3>
                <div className='space-y-4'>
                  {(() => {
                    const todayTasks = tasks.filter(task => {
                      if (!task.date) return !task.date;
                      const taskDate = new Date(task.date);
                      const today = new Date();
                      return taskDate.toDateString() === today.toDateString();
                    });
                    const completed = todayTasks.filter(t => t.completed).length;
                    const pending = todayTasks.length - completed;
                    const maxValue = Math.max(completed, pending, 1);
                    
                    return (
                      <>
                        {/* Concluídas */}
                        <div className='space-y-2'>
                          <div className='flex justify-between items-center'>
                            <span className='text-white text-sm'>Concluídas</span>
                            <span className='text-white font-bold'>{completed}</span>
                          </div>
                          <div className='w-full bg-gray-700/30 rounded-full h-4'>
                            <div 
                              className='h-4 rounded-full transition-all duration-1000'
                              style={{
                                width: `${(completed / maxValue) * 100}%`,
                                background: 'linear-gradient(90deg, #3EF2A3 0%, #2DD4BF 100%)',
                                boxShadow: '0 0 10px rgba(62, 242, 163, 0.4)'
                              }}
                            ></div>
                          </div>
                        </div>
                        
                        {/* Pendentes */}
                        <div className='space-y-2'>
                          <div className='flex justify-between items-center'>
                            <span className='text-white text-sm'>Pendentes</span>
                            <span className='text-white font-bold'>{pending}</span>
                          </div>
                          <div className='w-full bg-gray-700/30 rounded-full h-4'>
                            <div 
                              className='h-4 rounded-full transition-all duration-1000'
                              style={{
                                width: `${(pending / maxValue) * 100}%`,
                                background: 'linear-gradient(90deg, #FF82C8 0%, #F472B6 100%)',
                                boxShadow: '0 0 10px rgba(255, 130, 200, 0.4)'
                              }}
                            ></div>
                          </div>
                        </div>
                      </>
                    );
                  })()}
                </div>
              </div>

              {/* 3. Tendência Semanal - Linha com Pontos */}
              <div className='bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20'>
                <h3 className='text-white font-semibold mb-6'>Tendência Semanal</h3>
                <div className='relative h-32'>
                  <svg className='w-full h-full' viewBox='0 0 400 120'>
                    {/* Grid lines */}
                    {[0, 25, 50, 75, 100].map(y => (
                      <line 
                        key={y} 
                        x1='40' 
                        y1={100 - y * 0.6} 
                        x2='380' 
                        y2={100 - y * 0.6} 
                        stroke='rgba(255,255,255,0.1)' 
                        strokeWidth='1'
                      />
                    ))}
                    
                    {/* Line chart */}
                    <defs>
                      <linearGradient id='weeklyGradient' x1='0%' y1='0%' x2='0%' y2='100%'>
                        <stop offset='0%' stopColor='#46B9FF' stopOpacity='0.3' />
                        <stop offset='100%' stopColor='#46B9FF' stopOpacity='0' />
                      </linearGradient>
                    </defs>
                    
                    {(() => {
                      const weekDays = ['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb', 'Dom'];
                      const weekData = [85, 92, 78, 95, 88, 90, 82]; // Mock data
                      const points = weekData.map((value, index) => ({
                        x: 60 + (index * 45),
                        y: 100 - (value * 0.6)
                      }));
                      
                      return (
                        <g>
                          {/* Area under curve */}
                          <path
                            d={`M 60 100 ${points.map(p => `L ${p.x} ${p.y}`).join(' ')} L 375 100 Z`}
                            fill='url(#weeklyGradient)'
                          />
                          
                          {/* Line */}
                          <path
                            d={`M ${points[0].x} ${points[0].y} ${points.slice(1).map(p => `L ${p.x} ${p.y}`).join(' ')}`}
                            stroke='#46B9FF'
                            strokeWidth='3'
                            fill='none'
                          />
                          
                          {/* Points */}
                          {points.map((point, index) => (
                            <circle
                              key={index}
                              cx={point.x}
                              cy={point.y}
                              r='5'
                              fill='#A07CFF'
                              stroke='#46B9FF'
                              strokeWidth='2'
                            />
                          ))}
                          
                          {/* X-axis labels */}
                          {weekDays.map((day, index) => (
                            <text
                              key={day}
                              x={60 + (index * 45)}
                              y='115'
                              textAnchor='middle'
                              fill='rgba(255,255,255,0.7)'
                              fontSize='10'
                            >
                              {day}
                            </text>
                          ))}
                        </g>
                      );
                    })()}
                  </svg>
                </div>
              </div>

              {/* 4. Histórico Mensal/Semanal/Diário - Colunas Verticais */}
              <div className='bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20'>
                <div className='flex items-center justify-between mb-6'>
                  <h3 className='text-white font-semibold'>Evolução de Rotinas</h3>
                  <div className='flex space-x-2'>
                    {['Mensal', 'Semanal', 'Diário'].map((filter) => (
                      <button
                        key={filter}
                        onClick={() => setHistoryFilter(filter)}
                        className={`px-3 py-1 rounded-lg text-xs transition-all duration-300 ${
                          historyFilter === filter
                            ? 'bg-[#46B9FF]/20 text-[#46B9FF] shadow-lg'
                            : 'text-white/50 hover:bg-white/10 hover:text-white/80'
                        }`}
                      >
                        {filter}
                      </button>
                    ))}
                  </div>
                </div>
                
                {/* Chart Container */}
                <div className='relative pl-12 pb-16'>
                  {/* Y-axis labels */}
                  <div className='absolute left-0 top-0 h-40 flex flex-col-reverse justify-between text-xs text-white/60 w-10'>
                    <span className='text-right' style={{ transform: 'translateY(50%)' }}>0%</span>
                    <span className='text-right'>25%</span>
                    <span className='text-right'>50%</span>
                    <span className='text-right'>75%</span>
                    <span className='text-right'>100%</span>
                  </div>
                  
                  {/* Chart bars */}
                  <div className='flex justify-between h-40 relative' style={{ alignItems: 'flex-end' }}>
                    {(() => {
                      const getHistoryData = () => {
                        switch(historyFilter) {
                          case 'Mensal':
                            return [
                              { label: 'Jan', total: 45, completed: 38, isActive: false },
                              { label: 'Fev', total: 52, completed: 46, isActive: false },
                              { label: 'Mar', total: 48, completed: 42, isActive: false },
                              { label: 'Abr', total: 50, completed: 45, isActive: false },
                              { label: 'Mai', total: 55, completed: 50, isActive: false },
                              { label: 'Jun', total: 49, completed: 42, isActive: false },
                              { label: 'Jul', total: 53, completed: 48, isActive: false },
                              { label: 'Ago', total: 51, completed: 44, isActive: false },
                              { label: 'Set', total: 58, completed: 52, isActive: false },
                              { label: 'Out', total: 25, completed: 21, isActive: true }
                            ];
                          case 'Semanal':
                            return [
                              { label: 'Sem 1', total: 14, completed: 12, isActive: false },
                              { label: 'Sem 2', total: 15, completed: 13, isActive: false },
                              { label: 'Sem 3', total: 16, completed: 14, isActive: false },
                              { label: 'Sem 4', total: 18, completed: 15, isActive: true }
                            ];
                          case 'Diário':
                            return [
                              { label: 'Seg', total: 8, completed: 7, isActive: false },
                              { label: 'Ter', total: 9, completed: 8, isActive: true },
                              { label: 'Qua', total: 7, completed: 6, isActive: false },
                              { label: 'Qui', total: 8, completed: 7, isActive: false },
                              { label: 'Sex', total: 10, completed: 9, isActive: false },
                              { label: 'Sáb', total: 6, completed: 5, isActive: false },
                              { label: 'Dom', total: 5, completed: 4, isActive: false }
                            ];
                          default:
                            return [];
                        }
                      };
                      
                      const data = getHistoryData();
                      
                      return data.map((item, index) => {
                        const percentage = item.total > 0 ? (item.completed / item.total) * 100 : 0;
                        const height = (percentage / 100) * 140; // Max height 140px
                        const prevItem = index > 0 ? data[index - 1] : null;
                        const prevPercentage = prevItem && prevItem.total > 0 ? (prevItem.completed / prevItem.total) * 100 : 0;
                        const difference = prevItem ? percentage - prevPercentage : 0;
                        
                        return (
                          <div key={`${historyFilter}-${item.label}`} className='flex flex-col items-center group relative min-w-0'>
                            {/* Tooltip */}
                            <div className='absolute bottom-full mb-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none z-10'>
                              <div className='bg-black/90 text-white text-xs rounded-lg p-3 whitespace-nowrap'>
                                <div className='font-semibold'>{item.label}</div>
                                <div>{item.completed} de {item.total} rotinas concluídas</div>
                                <div className='text-[#46B9FF]'>{Math.round(percentage)}%</div>
                              </div>
                            </div>
                            
                            {/* Bar - aligned to bottom */}
                            <div 
                              className='rounded-t-lg transition-all duration-700 cursor-pointer transform hover:scale-105 mx-auto'
                              style={{ 
                                width: '60px',
                                height: `${height}px`,
                                background: item.isActive 
                                  ? 'linear-gradient(135deg, #46B9FF 0%, #A07CFF 100%)'
                                  : 'linear-gradient(135deg, #46B9FF80 0%, #A07CFF80 100%)',
                                boxShadow: item.isActive 
                                  ? '0 0 20px rgba(70, 185, 255, 0.4), 0 0 40px rgba(160, 124, 255, 0.2)' 
                                  : '0 4px 15px rgba(70, 185, 255, 0.1)',
                                animationDelay: `${index * 100}ms`,
                                animation: 'growUp 0.8s ease-out forwards'
                              }}
                            ></div>
                            
                            {/* Label with comparison - positioned below the baseline */}
                            <div className='text-center w-full absolute' style={{ top: '100%', paddingTop: '8px' }}>
                              <div className={`text-xs truncate ${item.isActive ? 'text-[#46B9FF] font-bold' : 'text-white/60'}`}>
                                {item.label}
                              </div>
                              {prevItem && (
                                <div className={`text-xs mt-1 flex items-center justify-center ${
                                  difference > 0 ? 'text-[#3EF2A3]' : difference < 0 ? 'text-[#FF82C8]' : 'text-white/40'
                                }`}>
                                  {difference > 0 ? '↑' : difference < 0 ? '↓' : '→'}
                                  {Math.abs(difference).toFixed(0)}%
                                </div>
                              )}
                            </div>
                          </div>
                        );
                      });
                    })()}
                  </div>
                  
                  {/* Period Summary */}
                  <div className='mt-20 p-3 bg-white/5 rounded-lg'>
                    <div className='flex justify-between items-center text-sm'>
                      <span className='text-white/70'>Período atual:</span>
                      <span className='text-white font-medium'>
                        {(() => {
                          const data = historyFilter === 'Mensal' 
                            ? { total: 25, completed: 21 }
                            : historyFilter === 'Semanal'
                            ? { total: 18, completed: 15 }
                            : { total: 9, completed: 8 };
                          const percentage = data.total > 0 ? Math.round((data.completed / data.total) * 100) : 0;
                          return `${data.completed}/${data.total} rotinas (${percentage}%)`;
                        })()}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* 5. Ranking Pessoal - Gamificação */}
              <div className='bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20'>
                <h3 className='text-white font-semibold mb-6'>Ranking de Categorias</h3>
                <div className='space-y-4'>
                  {[
                    { name: 'Rotinas de Estudo', value: 92, color: '#46B9FF', icon: '📚' },
                    { name: 'Saúde & Exercícios', value: 85, color: '#3EF2A3', icon: '💪' },
                    { name: 'Sono & Descanso', value: 78, color: '#A07CFF', icon: '😴' }
                  ].map((category, index) => (
                    <div key={category.name} className='space-y-2'>
                      <div className='flex items-center justify-between'>
                        <div className='flex items-center space-x-3'>
                          <span className='text-xl'>{category.icon}</span>
                          <span className='text-white text-sm'>{category.name}</span>
                        </div>
                        <div className='flex items-center space-x-2'>
                          <span className='text-white font-bold'>{category.value}%</span>
                          <div className='text-lg'>
                            {index === 0 ? '🥇' : index === 1 ? '🥈' : '🥉'}
                          </div>
                        </div>
                      </div>
                      <div className='w-full bg-[#1E0C3A] rounded-full h-3'>
                        <div 
                          className='h-3 rounded-full transition-all duration-1000'
                          style={{
                            width: `${category.value}%`,
                            background: `linear-gradient(90deg, ${category.color} 0%, ${category.color}CC 100%)`,
                            boxShadow: `0 0 10px ${category.color}66`
                          }}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Bottom Navigation */}
        <div className='fixed bottom-0 left-0 right-0 bg-white/10 backdrop-blur-md border-t border-white/20'>
          <div className='flex items-center justify-around py-3'>
            <button className='p-3 text-cyan-400'>
              <svg className='w-6 h-6' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6' />
              </svg>
            </button>

            <button className='p-3 text-white/60 hover:text-white'>
              <svg className='w-6 h-6' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z' />
              </svg>
            </button>

            <button className='p-3 text-white/60 hover:text-white'>
              <div className='w-8 h-8 bg-gradient-to-br from-purple-400 to-pink-400 rounded-full flex items-center justify-center'>
                <span className='text-white text-xs font-bold'>U</span>
              </div>
            </button>

            <button className='p-3 text-white/60 hover:text-white'>
              <svg className='w-6 h-6' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4' />
              </svg>
            </button>
          </div>
        </div>
      </div>
      
      <style jsx>{`
        @keyframes growUp {
          from {
            height: 0;
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
      `}</style>
    </div>
  )
}
