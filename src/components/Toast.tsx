'use client'

import { useEffect } from 'react'

interface ToastProps {
  message: string
  type?: 'success' | 'error' | 'info' | 'warning'
  onClose: () => void
  duration?: number
}

export default function Toast({ message, type = 'info', onClose, duration = 3000 }: ToastProps) {
  useEffect(() => {
    const timer = setTimeout(onClose, duration)
    return () => clearTimeout(timer)
  }, [duration, onClose])

  const styles = {
    success: 'bg-gradient-to-r from-green-500 to-emerald-500 border-green-400',
    error: 'bg-gradient-to-r from-red-500 to-rose-500 border-red-400',
    info: 'bg-gradient-to-r from-blue-500 to-cyan-500 border-blue-400',
    warning: 'bg-gradient-to-r from-yellow-500 to-orange-500 border-yellow-400'
  }

  const icons = {
    success: '✅',
    error: '❌',
    info: 'ℹ️',
    warning: '⚠️'
  }

  return (
    <div className="fixed bottom-6 right-6 z-[100] animate-slide-up">
      <div className={`${styles[type]} text-white px-6 py-4 rounded-xl shadow-2xl border-2 flex items-center gap-3 min-w-[320px] backdrop-blur-md transform hover:scale-105 transition-transform duration-200`}>
        <span className="text-2xl animate-bounce-once">{icons[type]}</span>
        <p className="flex-1 font-medium">{message}</p>
        <button 
          onClick={onClose}
          className="text-white/80 hover:text-white transition-colors text-xl hover:rotate-90 transform duration-200"
        >
          ✕
        </button>
      </div>
    </div>
  )
}
