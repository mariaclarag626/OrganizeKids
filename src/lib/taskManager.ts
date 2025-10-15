// TaskManager - Gerenciamento de tarefas compartilhadas entre pais e filhos

export interface Task {
  id: string
  title: string
  description?: string
  category: 'hygiene' | 'school' | 'domestic' | 'food' | 'leisure' | 'sleep' | 'responsibility'
  points: number // Pontos em incrementos de 10
  
  // Atribuição
  familyId: string
  assignedTo: string // ID do filho
  assignedBy: string // ID do pai
  
  // Status
  status: 'pending' | 'completed' | 'approved' | 'rejected'
  completedAt?: string
  approvedAt?: string
  approvedBy?: string
  rejectionReason?: string
  
  // Recorrência
  recurrence: 'once' | 'daily' | 'weekly' | 'monthly'
  weekDays?: number[] // Para semanal: [0,1,2,3,4,5,6] (domingo-sábado)
  monthDay?: number // Para mensal: dia do mês (1-31)
  
  // Datas
  dueDate?: string
  createdAt: string
  updatedAt: string
}

export interface TaskCompletion {
  taskId: string
  childId: string
  completedAt: string
  pointsEarned: number
}

export class TaskManager {
  private static TASKS_KEY = 'organizekids_tasks'
  private static COMPLETIONS_KEY = 'organizekids_task_completions'

  // Criar tarefa (pai)
  static createTask(
    familyId: string,
    assignedTo: string,
    assignedBy: string,
    taskData: {
      title: string
      description?: string
      category: Task['category']
      points: number
      recurrence: Task['recurrence']
      weekDays?: number[]
      monthDay?: number
      dueDate?: string
    }
  ): Task {
    if (typeof window === 'undefined') return {} as Task

    const task: Task = {
      id: `task-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      familyId,
      assignedTo,
      assignedBy,
      status: 'pending',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      ...taskData
    }

    const tasks = this.getAllTasks()
    tasks.push(task)
    this.saveTasks(tasks)

    return task
  }

  // Filho marca tarefa como completada
  static completeTask(taskId: string, childId: string): { success: boolean; message: string } {
    if (typeof window === 'undefined') return { success: false, message: 'Erro' }

    const tasks = this.getAllTasks()
    const task = tasks.find(t => t.id === taskId)

    if (!task) {
      return { success: false, message: 'Tarefa não encontrada' }
    }

    if (task.assignedTo !== childId) {
      return { success: false, message: 'Esta tarefa não é sua!' }
    }

    if (task.status !== 'pending') {
      return { success: false, message: 'Tarefa já foi concluída' }
    }

    task.status = 'completed'
    task.completedAt = new Date().toISOString()
    task.updatedAt = new Date().toISOString()

    this.saveTasks(tasks)
    return { success: true, message: 'Tarefa concluída! Aguardando aprovação dos pais.' }
  }

  // Pai aprova tarefa
  static approveTask(taskId: string, parentId: string): { success: boolean; message: string; pointsAwarded?: number } {
    if (typeof window === 'undefined') return { success: false, message: 'Erro' }

    const tasks = this.getAllTasks()
    const task = tasks.find(t => t.id === taskId)

    if (!task) {
      return { success: false, message: 'Tarefa não encontrada' }
    }

    if (task.status !== 'completed') {
      return { success: false, message: 'Tarefa não está aguardando aprovação' }
    }

    task.status = 'approved'
    task.approvedAt = new Date().toISOString()
    task.approvedBy = parentId
    task.updatedAt = new Date().toISOString()

    // Registrar conclusão e pontos
    const completion: TaskCompletion = {
      taskId: task.id,
      childId: task.assignedTo,
      completedAt: task.completedAt!,
      pointsEarned: task.points
    }
    this.addCompletion(completion)

    // Se for recorrente, criar próxima tarefa
    if (task.recurrence !== 'once') {
      this.createRecurringTask(task)
    }

    this.saveTasks(tasks)
    return { success: true, message: 'Tarefa aprovada!', pointsAwarded: task.points }
  }

  // Pai rejeita tarefa
  static rejectTask(taskId: string, parentId: string, reason?: string): { success: boolean; message: string } {
    if (typeof window === 'undefined') return { success: false, message: 'Erro' }

    const tasks = this.getAllTasks()
    const task = tasks.find(t => t.id === taskId)

    if (!task) {
      return { success: false, message: 'Tarefa não encontrada' }
    }

    if (task.status !== 'completed') {
      return { success: false, message: 'Tarefa não está aguardando aprovação' }
    }

    task.status = 'pending'
    task.rejectionReason = reason
    task.completedAt = undefined
    task.updatedAt = new Date().toISOString()

    this.saveTasks(tasks)
    return { success: true, message: 'Tarefa rejeitada. O filho precisará refazê-la.' }
  }

  // Deletar tarefa (pai)
  static deleteTask(taskId: string, parentId: string): boolean {
    if (typeof window === 'undefined') return false

    const tasks = this.getAllTasks()
    const taskIndex = tasks.findIndex(t => t.id === taskId && t.assignedBy === parentId)

    if (taskIndex === -1) return false

    tasks.splice(taskIndex, 1)
    this.saveTasks(tasks)
    return true
  }

  // Pegar tarefas de um filho
  static getChildTasks(childId: string, filter?: { status?: Task['status']; category?: Task['category'] }): Task[] {
    const tasks = this.getAllTasks()
    
    return tasks.filter(task => {
      if (task.assignedTo !== childId) return false
      if (filter?.status && task.status !== filter.status) return false
      if (filter?.category && task.category !== filter.category) return false
      return true
    })
  }

  // Pegar tarefas de uma família
  static getFamilyTasks(familyId: string, filter?: { assignedTo?: string; status?: Task['status'] }): Task[] {
    const tasks = this.getAllTasks()
    
    return tasks.filter(task => {
      if (task.familyId !== familyId) return false
      if (filter?.assignedTo && task.assignedTo !== filter.assignedTo) return false
      if (filter?.status && task.status !== filter.status) return false
      return true
    })
  }

  // Pegar pontos totais de um filho
  static getChildPoints(childId: string): number {
    const completions = this.getAllCompletions()
    return completions
      .filter(c => c.childId === childId)
      .reduce((total, c) => total + c.pointsEarned, 0)
  }

  // Pegar estatísticas de um filho
  static getChildStats(childId: string): {
    totalPoints: number
    tasksCompleted: number
    tasksApproved: number
    tasksPending: number
    tasksAwaitingApproval: number
  } {
    const tasks = this.getChildTasks(childId)
    const completions = this.getAllCompletions().filter(c => c.childId === childId)

    return {
      totalPoints: completions.reduce((total, c) => total + c.pointsEarned, 0),
      tasksCompleted: completions.length,
      tasksApproved: tasks.filter(t => t.status === 'approved').length,
      tasksPending: tasks.filter(t => t.status === 'pending').length,
      tasksAwaitingApproval: tasks.filter(t => t.status === 'completed').length
    }
  }

  // Criar próxima tarefa recorrente
  private static createRecurringTask(originalTask: Task): void {
    const nextTask: Task = {
      ...originalTask,
      id: `task-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      status: 'pending',
      completedAt: undefined,
      approvedAt: undefined,
      approvedBy: undefined,
      rejectionReason: undefined,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }

    // Calcular próxima data de vencimento
    if (originalTask.dueDate) {
      const currentDue = new Date(originalTask.dueDate)
      
      switch (originalTask.recurrence) {
        case 'daily':
          currentDue.setDate(currentDue.getDate() + 1)
          break
        case 'weekly':
          currentDue.setDate(currentDue.getDate() + 7)
          break
        case 'monthly':
          currentDue.setMonth(currentDue.getMonth() + 1)
          break
      }
      
      nextTask.dueDate = currentDue.toISOString()
    }

    const tasks = this.getAllTasks()
    tasks.push(nextTask)
    this.saveTasks(tasks)
  }

  // Helpers privados
  private static getAllTasks(): Task[] {
    if (typeof window === 'undefined') return []
    const data = localStorage.getItem(this.TASKS_KEY)
    return data ? JSON.parse(data) : []
  }

  private static saveTasks(tasks: Task[]): void {
    if (typeof window === 'undefined') return
    localStorage.setItem(this.TASKS_KEY, JSON.stringify(tasks))
  }

  private static getAllCompletions(): TaskCompletion[] {
    if (typeof window === 'undefined') return []
    const data = localStorage.getItem(this.COMPLETIONS_KEY)
    return data ? JSON.parse(data) : []
  }

  private static addCompletion(completion: TaskCompletion): void {
    if (typeof window === 'undefined') return
    const completions = this.getAllCompletions()
    completions.push(completion)
    localStorage.setItem(this.COMPLETIONS_KEY, JSON.stringify(completions))
  }
}
