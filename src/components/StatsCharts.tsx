'use client'

import { PieChart, Pie, Cell, BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'

interface StatsChartsProps {
  tasks: any[]
  pomodoroStats: { sessionsCompleted: number; pointsEarned: number }
}

export default function StatsCharts({ tasks, pomodoroStats }: StatsChartsProps) {
  // Category distribution data
  const categoryData = ['estudos', 'domestico', 'saude', 'lazer', 'pessoal'].map(cat => {
    const catTasks = tasks.filter(t => t.category === cat)
    return {
      name: cat.charAt(0).toUpperCase() + cat.slice(1),
      value: catTasks.length,
      completed: catTasks.filter(t => t.status === 'completed').length
    }
  })

  // Points by category data
  const pointsData = ['estudos', 'domestico', 'saude', 'lazer', 'pessoal'].map(cat => ({
    name: cat.charAt(0).toUpperCase() + cat.slice(1),
    pontos: tasks
      .filter(t => t.category === cat && t.status === 'completed')
      .reduce((sum, t) => sum + t.points, 0)
  }))

  // Weekly progress (mock data - you can make this dynamic)
  const weeklyData = [
    { dia: 'Seg', tarefas: 3, pontos: 80 },
    { dia: 'Ter', tarefas: 5, pontos: 120 },
    { dia: 'Qua', tarefas: 4, pontos: 100 },
    { dia: 'Qui', tarefas: 6, pontos: 150 },
    { dia: 'Sex', tarefas: 4, pontos: 90 },
    { dia: 'Sáb', tarefas: 2, pontos: 50 },
    { dia: 'Dom', tarefas: 1, pontos: 30 },
  ]

  const COLORS = ['#3b82f6', '#f97316', '#10b981', '#a855f7', '#eab308']

  return (
    <div className="space-y-6">
      {/* Pie Chart - Category Distribution */}
      <div className="bg-slate-800/50 backdrop-blur-md rounded-xl p-6 border border-slate-700/50">
        <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
          📊 Distribuição de Tarefas por Categoria
        </h3>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={categoryData}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={(entry: any) => `${entry.name}: ${(entry.percent * 100).toFixed(0)}%`}
              outerRadius={80}
              fill="#8884d8"
              dataKey="value"
            >
              {categoryData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </div>

      {/* Bar Chart - Points by Category */}
      <div className="bg-slate-800/50 backdrop-blur-md rounded-xl p-6 border border-slate-700/50">
        <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
          💰 Pontos Conquistados por Categoria
        </h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={pointsData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
            <XAxis dataKey="name" stroke="#94a3b8" />
            <YAxis stroke="#94a3b8" />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: '#1e293b', 
                border: '1px solid #475569',
                borderRadius: '8px'
              }}
            />
            <Bar dataKey="pontos" fill="#eab308" radius={[8, 8, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Line Chart - Weekly Progress */}
      <div className="bg-slate-800/50 backdrop-blur-md rounded-xl p-6 border border-slate-700/50">
        <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
          📈 Progresso Semanal
        </h3>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={weeklyData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
            <XAxis dataKey="dia" stroke="#94a3b8" />
            <YAxis yAxisId="left" stroke="#94a3b8" />
            <YAxis yAxisId="right" orientation="right" stroke="#94a3b8" />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: '#1e293b', 
                border: '1px solid #475569',
                borderRadius: '8px'
              }}
            />
            <Legend />
            <Line 
              yAxisId="left"
              type="monotone" 
              dataKey="tarefas" 
              stroke="#3b82f6" 
              strokeWidth={2}
              dot={{ r: 4 }}
              activeDot={{ r: 6 }}
            />
            <Line 
              yAxisId="right"
              type="monotone" 
              dataKey="pontos" 
              stroke="#eab308" 
              strokeWidth={2}
              dot={{ r: 4 }}
              activeDot={{ r: 6 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
