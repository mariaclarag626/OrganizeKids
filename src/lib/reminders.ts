'use client'

import { notificationManager } from './notifications'

export interface Reminder {
  id: string
  title: string
  message: string
  triggerDate: Date
  type: 'task' | 'deadline' | 'routine' | 'pomodoro'
  priority: 'low' | 'medium' | 'high'
  enabled: boolean
}

export class ReminderSystem {
  private static instance: ReminderSystem
  private reminders: Map<string, Reminder> = new Map()
  private intervals: Map<string, NodeJS.Timeout> = new Map()

  private constructor() {
    this.checkReminders()
    // Check every minute
    setInterval(() => this.checkReminders(), 60000)
  }

  static getInstance(): ReminderSystem {
    if (!ReminderSystem.instance) {
      ReminderSystem.instance = new ReminderSystem()
    }
    return ReminderSystem.instance
  }

  addReminder(reminder: Reminder): void {
    this.reminders.set(reminder.id, reminder)
    this.saveReminders()
  }

  removeReminder(id: string): void {
    this.reminders.delete(id)
    const interval = this.intervals.get(id)
    if (interval) {
      clearTimeout(interval)
      this.intervals.delete(id)
    }
    this.saveReminders()
  }

  private checkReminders(): void {
    const now = new Date()
    
    this.reminders.forEach((reminder) => {
      if (!reminder.enabled) return
      
      const timeDiff = reminder.triggerDate.getTime() - now.getTime()
      const hoursDiff = timeDiff / (1000 * 60 * 60)
      
      // Send notification if within 1 hour
      if (hoursDiff <= 1 && hoursDiff > 0) {
        this.sendReminderNotification(reminder)
      }
      
      // Remove if past due
      if (timeDiff < 0) {
        this.removeReminder(reminder.id)
      }
    })
  }

  private sendReminderNotification(reminder: Reminder): void {
    const icons: Record<string, string> = {
      task: '✅',
      deadline: '⏰',
      routine: '🔄',
      pomodoro: '⏱️'
    }

    if (notificationManager) {
      notificationManager.sendNotification({
        title: `${icons[reminder.type]} ${reminder.title}`,
        body: reminder.message,
        requireInteraction: reminder.priority === 'high'
      })
    }
  }

  private saveReminders(): void {
    if (typeof window !== 'undefined') {
      const remindersArray = Array.from(this.reminders.values())
      localStorage.setItem('reminders', JSON.stringify(remindersArray))
    }
  }

  loadReminders(): void {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('reminders')
      if (saved) {
        const remindersArray = JSON.parse(saved) as Reminder[]
        remindersArray.forEach(r => {
          this.reminders.set(r.id, {
            ...r,
            triggerDate: new Date(r.triggerDate)
          })
        })
      }
    }
  }

  // Auto-create reminders for deadlines
  createDeadlineReminder(taskId: string, title: string, deadline: Date): void {
    // 1 day before
    const oneDayBefore = new Date(deadline)
    oneDayBefore.setDate(oneDayBefore.getDate() - 1)
    
    this.addReminder({
      id: `deadline-${taskId}-1d`,
      title: 'Deadline Próximo!',
      message: `"${title}" vence amanhã!`,
      triggerDate: oneDayBefore,
      type: 'deadline',
      priority: 'high',
      enabled: true
    })

    // 1 hour before
    const oneHourBefore = new Date(deadline)
    oneHourBefore.setHours(oneHourBefore.getHours() - 1)
    
    this.addReminder({
      id: `deadline-${taskId}-1h`,
      title: 'Deadline Urgente!',
      message: `"${title}" vence em 1 hora!`,
      triggerDate: oneHourBefore,
      type: 'deadline',
      priority: 'high',
      enabled: true
    })
  }

  // Daily routine reminder
  createRoutineReminder(routineId: string, name: string, hour: number, minute: number): void {
    const now = new Date()
    const reminderTime = new Date()
    reminderTime.setHours(hour, minute, 0, 0)
    
    if (reminderTime < now) {
      reminderTime.setDate(reminderTime.getDate() + 1)
    }

    this.addReminder({
      id: `routine-${routineId}`,
      title: 'Hora da Rotina!',
      message: `Não esqueça: ${name}`,
      triggerDate: reminderTime,
      type: 'routine',
      priority: 'medium',
      enabled: true
    })
  }
}

export const reminderSystem = typeof window !== 'undefined' 
  ? ReminderSystem.getInstance() 
  : null
