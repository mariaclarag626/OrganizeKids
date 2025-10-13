import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/db'
import { tasks, userPoints, households, householdMembers } from '@/db/schema'
import { eq, and } from 'drizzle-orm'

export async function GET(request: NextRequest) {
  try {
    if (!db) {
      return NextResponse.json({ error: 'Database not connected' }, { status: 500 })
    }

    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')
    const householdId = searchParams.get('householdId')

    if (!userId) {
      return NextResponse.json({ error: 'userId is required' }, { status: 400 })
    }

    // Get user's tasks
    const userTasks = await db
      .select()
      .from(tasks)
      .where(
        and(
          eq(tasks.assignedTo, userId),
          householdId ? eq(tasks.householdId, householdId) : undefined
        )
      )
      .orderBy(tasks.dueDate)

    // Get user's points
    const points = await db
      .select()
      .from(userPoints)
      .where(eq(userPoints.userId, userId))

    return NextResponse.json({
      tasks: userTasks,
      points: points[0] || { points: 0, totalEarned: 0, totalSpent: 0 },
    })
  } catch (error) {
    console.error('Error fetching tasks:', error)
    return NextResponse.json({ error: 'Failed to fetch tasks' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    if (!db) {
      return NextResponse.json({ error: 'Database not connected' }, { status: 500 })
    }

    const body = await request.json()
    const { action, taskId, userId } = body

    if (action === 'complete') {
      // Mark task as completed
      const task = await db
        .select()
        .from(tasks)
        .where(eq(tasks.id, taskId))
        .limit(1)

      if (!task || task.length === 0) {
        return NextResponse.json({ error: 'Task not found' }, { status: 404 })
      }

      const taskData = task[0]

      // Update task
      await db
        .update(tasks)
        .set({
          isCompleted: true,
          completedAt: new Date(),
          completedBy: userId,
        })
        .where(eq(tasks.id, taskId))

      // Update user points
      const currentPoints = await db
        .select()
        .from(userPoints)
        .where(
          and(
            eq(userPoints.userId, userId),
            eq(userPoints.householdId, taskData.householdId)
          )
        )

      if (currentPoints.length > 0) {
        const pointsData = currentPoints[0]
        await db
          .update(userPoints)
          .set({
            points: (pointsData.points ?? 0) + (taskData.points || 0),
            totalEarned: (pointsData.totalEarned ?? 0) + (taskData.points || 0),
            lastUpdated: new Date(),
          })
          .where(eq(userPoints.id, pointsData.id))
      } else {
        await db.insert(userPoints).values({
          userId,
          householdId: taskData.householdId,
          points: taskData.points || 0,
          totalEarned: taskData.points || 0,
          totalSpent: 0,
        })
      }

      return NextResponse.json({
        success: true,
        pointsEarned: taskData.points,
      })
    }

    return NextResponse.json({ error: 'Invalid action' }, { status: 400 })
  } catch (error) {
    console.error('Error updating task:', error)
    return NextResponse.json({ error: 'Failed to update task' }, { status: 500 })
  }
}
