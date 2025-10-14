'use client'

export interface NotificationConfig {
  title: string
  body: string
  icon?: string
  tag?: string
  requireInteraction?: boolean
}

export class NotificationManager {
  private static instance: NotificationManager
  private permission: NotificationPermission = 'default'

  private constructor() {
    if (typeof window !== 'undefined' && 'Notification' in window) {
      this.permission = Notification.permission
    }
  }

  static getInstance(): NotificationManager {
    if (!NotificationManager.instance) {
      NotificationManager.instance = new NotificationManager()
    }
    return NotificationManager.instance
  }

  async requestPermission(): Promise<boolean> {
    if (typeof window === 'undefined' || !('Notification' in window)) {
      console.warn('Notificações não suportadas neste navegador')
      return false
    }

    if (this.permission === 'granted') {
      return true
    }

    try {
      const permission = await Notification.requestPermission()
      this.permission = permission
      return permission === 'granted'
    } catch (error) {
      console.error('Erro ao solicitar permissão de notificação:', error)
      return false
    }
  }

  async sendNotification(config: NotificationConfig): Promise<boolean> {
    if (this.permission !== 'granted') {
      const granted = await this.requestPermission()
      if (!granted) {
        console.warn('Permissão de notificação negada')
        return false
      }
    }

    try {
      const notification = new Notification(config.title, {
        body: config.body,
        icon: config.icon || '/logo.png',
        badge: '/logo.png',
        tag: config.tag,
        requireInteraction: config.requireInteraction || false,
      })

      notification.onclick = () => {
        window.focus()
        notification.close()
      }

      return true
    } catch (error) {
      console.error('Erro ao enviar notificação:', error)
      return false
    }
  }

  // Notificações para tarefas
  async notifyTaskDue(taskTitle: string, dueTime: string): Promise<boolean> {
    return this.sendNotification({
      title: '⏰ Lembrete de Tarefa',
      body: `Não esqueça: ${taskTitle} - Prazo: ${dueTime}`,
      tag: 'task-reminder',
      requireInteraction: true,
    })
  }

  // Notificações para rotinas
  async notifyRoutine(routineName: string, time: string): Promise<boolean> {
    return this.sendNotification({
      title: '🌟 Hora da Rotina!',
      body: `É hora de: ${routineName} - ${time}`,
      tag: 'routine-reminder',
    })
  }

  // Notificações de conquistas
  async notifyAchievement(achievementTitle: string): Promise<boolean> {
    return this.sendNotification({
      title: '🎉 Conquista Desbloqueada!',
      body: achievementTitle,
      tag: 'achievement',
      requireInteraction: true,
    })
  }

  // Notificações de pontos
  async notifyPoints(points: number, reason: string): Promise<boolean> {
    return this.sendNotification({
      title: `⭐ +${points} Pontos!`,
      body: reason,
      tag: 'points',
    })
  }

  // Agendar notificação
  scheduleNotification(config: NotificationConfig, delay: number): void {
    setTimeout(() => {
      this.sendNotification(config)
    }, delay)
  }

  // Verificar suporte
  isSupported(): boolean {
    return typeof window !== 'undefined' && 'Notification' in window
  }

  // Verificar permissão
  hasPermission(): boolean {
    return this.permission === 'granted'
  }

  getPermission(): NotificationPermission {
    return this.permission
  }
}

// Export singleton instance
export const notificationManager = typeof window !== 'undefined' 
  ? NotificationManager.getInstance() 
  : null
