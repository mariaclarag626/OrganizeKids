'use client'

import { useState, useEffect } from 'react'

// Hook para buscar dados do dashboard
export function useDashboardData(userId: string | null, householdId: string | null) {
  const [tasks, setTasks] = useState<any[]>([])
  const [points, setPoints] = useState(0)
  const [rewards, setRewards] = useState<any[]>([])
  const [achievements, setAchievements] = useState<any[]>([])
  const [ranking, setRanking] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchData = async () => {
    if (!userId || !householdId) {
      setLoading(false)
      return
    }

    try {
      setLoading(true)
      
      // Fetch tasks and points
      const tasksRes = await fetch(`/api/tasks?userId=${userId}&householdId=${householdId}`)
      if (tasksRes.ok) {
        const tasksData = await tasksRes.json()
        setTasks(tasksData.tasks || [])
        setPoints(tasksData.points?.points || 0)
      }

      // Fetch rewards
      const rewardsRes = await fetch(`/api/rewards?householdId=${householdId}`)
      if (rewardsRes.ok) {
        const rewardsData = await rewardsRes.json()
        setRewards(rewardsData.rewards || [])
      }

      // Fetch achievements
      const achievementsRes = await fetch(`/api/achievements?userId=${userId}`)
      if (achievementsRes.ok) {
        const achievementsData = await achievementsRes.json()
        setAchievements(achievementsData.achievements || [])
      }

      // Fetch ranking
      const rankingRes = await fetch(`/api/ranking?householdId=${householdId}&userId=${userId}`)
      if (rankingRes.ok) {
        const rankingData = await rankingRes.json()
        setRanking(rankingData.ranking || [])
      }

      setLoading(false)
    } catch (err) {
      console.error('Error fetching dashboard data:', err)
      setError('Falha ao carregar dados')
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [userId, householdId])

  return {
    tasks,
    setTasks,
    points,
    setPoints,
    rewards,
    achievements,
    ranking,
    setRanking,
    loading,
    error,
    refetch: fetchData,
  }
}

// Hook para completar tarefa
export function useCompleteTask() {
  const [isCompleting, setIsCompleting] = useState(false)

  const completeTask = async (taskId: string, userId: string) => {
    try {
      setIsCompleting(true)
      const res = await fetch('/api/tasks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'complete', taskId, userId }),
      })

      if (!res.ok) {
        throw new Error('Failed to complete task')
      }

      const data = await res.json()
      return data
    } catch (err) {
      console.error('Error completing task:', err)
      throw err
    } finally {
      setIsCompleting(false)
    }
  }

  return { completeTask, isCompleting }
}

// Hook para resgatar recompensa
export function useRedeemReward() {
  const [isRedeeming, setIsRedeeming] = useState(false)

  const redeemReward = async (rewardId: string, userId: string, householdId: string) => {
    try {
      setIsRedeeming(true)
      const res = await fetch('/api/rewards', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'redeem', rewardId, userId, householdId }),
      })

      if (!res.ok) {
        const errorData = await res.json()
        throw new Error(errorData.error || 'Failed to redeem reward')
      }

      const data = await res.json()
      return data
    } catch (err) {
      console.error('Error redeeming reward:', err)
      throw err
    } finally {
      setIsRedeeming(false)
    }
  }

  return { redeemReward, isRedeeming }
}
