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
                  <div className='absolute top-full mt-2 left-0 w-80 bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 p-4 shadow-xl z-10'>
                    {/* Calendar Header */}
                    <div className='flex items-center justify-between mb-4'>
                      <button className='p-1 hover:bg-white/10 rounded-lg transition-all'>
                        <svg className='w-5 h-5 text-white' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                          <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M15 19l-7-7 7-7' />
                        </svg>
                      </button>
                      <h3 className='text-white font-semibold text-lg'>March</h3>
                      <button className='p-1 hover:bg-white/10 rounded-lg transition-all'>
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
                      {/* Previous month days (grayed out) */}
                      {[28, 29].map((day) => (
                        <button key={`prev-${day}`} className='h-10 text-white/30 text-sm hover:bg-white/5 rounded-lg transition-all'>
                          {day}
                        </button>
                      ))}
                      
                      {/* Current month days */}
                      {Array.from({ length: 31 }, (_, i) => i + 1).map((day) => {
                        const isToday = day === 15; // Example: 15th is today
                        const isSelected = day >= 10 && day <= 16; // Example: range selection
                        
                        return (
                          <button
                            key={day}
                            onClick={() => {
                              const selectedDate = `2024-03-${day.toString().padStart(2, '0')}`;
                              setNewTask({ ...newTask, date: selectedDate });
                              setShowDatePicker(false);
                            }}
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
                        );
                      })}
                      
                      {/* Next month days (grayed out) */}
                      {[1, 2, 3, 4].map((day) => (
                        <button key={`next-${day}`} className='h-10 text-white/30 text-sm hover:bg-white/5 rounded-lg transition-all'>
                          {day}
                        </button>
                      ))}
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
                        const hours = value.padStart(2, '0');
                        const minutes = newTask.time.split(':')[1] || '00';
                        setNewTask({ ...newTask, time: `${hours}:${minutes}` });
                      }}
                      placeholder="00"
                      maxLength={2}
                      className='w-8 bg-transparent text-white text-sm text-center focus:outline-none placeholder:text-white/50'
                    />
                    <span className='text-white font-bold'>:</span>
                    <input
                      type="text"
                      value={newTask.time.split(':')[1] || ''}
                      onChange={(e) => {
                        const value = e.target.value.replace(/\D/g, '').slice(0, 2);
                        const minutes = value.padStart(2, '0');
                        const hours = newTask.time.split(':')[0] || '00';
                        setNewTask({ ...newTask, time: `${hours}:${minutes}` });
                      }}
                      placeholder="00"
                      maxLength={2}
                      className='w-8 bg-transparent text-white text-sm text-center focus:outline-none placeholder:text-white/50'
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
            <div className='flex items-center justify-center h-64'>
              <p className='text-white/70 text-lg'>Graphics/Progress content will be styled later</p>
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
    </div>
  )
}
