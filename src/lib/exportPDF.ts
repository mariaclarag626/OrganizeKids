'use client'

import jsPDF from 'jspdf'

export function exportStatsToPDF(data: {
  tasks: any[]
  totalPoints: number
  pomodoroStats: any
  userName?: string
}) {
  const { tasks, totalPoints, pomodoroStats, userName = 'Estudante' } = data
  
  const pdf = new jsPDF()
  
  // Title
  pdf.setFontSize(20)
  pdf.text('Relatório de Estatísticas - OrganizeKids', 20, 20)
  
  // User info
  pdf.setFontSize(12)
  pdf.text(`Aluno: ${userName}`, 20, 35)
  pdf.text(`Data: ${new Date().toLocaleDateString('pt-BR')}`, 20, 45)
  
  // Summary stats
  pdf.setFontSize(16)
  pdf.text('Resumo', 20, 60)
  
  pdf.setFontSize(12)
  const completedTasks = tasks.filter(t => t.status === 'completed').length
  const completionRate = tasks.length > 0 ? Math.round((completedTasks / tasks.length) * 100) : 0
  
  pdf.text(`Total de Tarefas: ${tasks.length}`, 30, 75)
  pdf.text(`Tarefas Concluídas: ${completedTasks}`, 30, 85)
  pdf.text(`Taxa de Conclusão: ${completionRate}%`, 30, 95)
  pdf.text(`Pontos Totais: ${totalPoints}`, 30, 105)
  pdf.text(`Sessões Pomodoro: ${pomodoroStats.sessionsCompleted}`, 30, 115)
  
  // Tasks by category
  pdf.setFontSize(16)
  pdf.text('Tarefas por Categoria', 20, 135)
  
  pdf.setFontSize(12)
  let yPos = 150
  const categories = ['estudos', 'domestico', 'saude', 'lazer', 'pessoal']
  
  categories.forEach(cat => {
    const catTasks = tasks.filter(t => t.category === cat)
    const catCompleted = catTasks.filter(t => t.status === 'completed').length
    const catPoints = tasks
      .filter(t => t.category === cat && t.status === 'completed')
      .reduce((sum, t) => sum + t.points, 0)
    
    pdf.text(
      `${cat.charAt(0).toUpperCase() + cat.slice(1)}: ${catCompleted}/${catTasks.length} tarefas - ${catPoints} pontos`,
      30,
      yPos
    )
    yPos += 10
  })
  
  // Recent completed tasks
  if (completedTasks > 0) {
    pdf.setFontSize(16)
    pdf.text('Últimas Tarefas Concluídas', 20, yPos + 15)
    
    pdf.setFontSize(10)
    yPos += 30
    
    const recentTasks = tasks.filter(t => t.status === 'completed').slice(0, 10)
    recentTasks.forEach(task => {
      if (yPos > 270) {
        pdf.addPage()
        yPos = 20
      }
      pdf.text(`• ${task.title} (+${task.points} pts)`, 30, yPos)
      yPos += 8
    })
  }
  
  // Footer
  const pageCount = (pdf as any).internal.getNumberOfPages()
  for (let i = 1; i <= pageCount; i++) {
    pdf.setPage(i)
    pdf.setFontSize(10)
    pdf.text(
      `Página ${i} de ${pageCount} - OrganizeKids © ${new Date().getFullYear()}`,
      pdf.internal.pageSize.width / 2,
      pdf.internal.pageSize.height - 10,
      { align: 'center' }
    )
  }
  
  // Download
  pdf.save(`estatisticas-${new Date().toISOString().split('T')[0]}.pdf`)
}
