import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/db'
import { rewards, rewardRedemptions, userPoints } from '@/db/schema'
import { eq, and } from 'drizzle-orm'

export async function GET(request: NextRequest) {
  try {
    if (!db) {
      return NextResponse.json({ error: 'Database not connected' }, { status: 500 })
    }

    const { searchParams } = new URL(request.url)
    const householdId = searchParams.get('householdId')

    if (!householdId) {
      return NextResponse.json({ error: 'householdId is required' }, { status: 400 })
    }

    const activeRewards = await db
      .select()
      .from(rewards)
      .where(
        and(
          eq(rewards.householdId, householdId),
          eq(rewards.isActive, true)
        )
      )
      .orderBy(rewards.cost)

    return NextResponse.json({ rewards: activeRewards })
  } catch (error) {
    console.error('Error fetching rewards:', error)
    return NextResponse.json({ error: 'Failed to fetch rewards' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    if (!db) {
      return NextResponse.json({ error: 'Database not connected' }, { status: 500 })
    }

    const body = await request.json()
    const { action, rewardId, userId, householdId } = body

    if (action === 'redeem') {
      // Get reward details
      const reward = await db
        .select()
        .from(rewards)
        .where(eq(rewards.id, rewardId))
        .limit(1)

      if (!reward || reward.length === 0) {
        return NextResponse.json({ error: 'Reward not found' }, { status: 404 })
      }

      const rewardData = reward[0]

      // Check if user has enough points
      const points = await db
        .select()
        .from(userPoints)
        .where(
          and(
            eq(userPoints.userId, userId),
            eq(userPoints.householdId, householdId)
          )
        )

      if (!points || points.length === 0 || (points[0]?.points ?? 0) < rewardData.cost) {
        return NextResponse.json(
          { error: 'Insufficient points' },
          { status: 400 }
        )
      }

      const pointsData = points[0]

      // Create redemption
      await db.insert(rewardRedemptions).values({
        rewardId,
        userId,
        householdId,
        pointsSpent: rewardData.cost,
        status: 'pending',
      })

      // Deduct points
      await db
        .update(userPoints)
        .set({
          points: (pointsData.points ?? 0) - rewardData.cost,
          totalSpent: (pointsData.totalSpent ?? 0) + rewardData.cost,
          lastUpdated: new Date(),
        })
        .where(eq(userPoints.id, pointsData.id))

      // Update stock if limited
      if (rewardData.stock !== null && rewardData.stock > 0) {
        await db
          .update(rewards)
          .set({ stock: rewardData.stock - 1 })
          .where(eq(rewards.id, rewardId))
      }

      return NextResponse.json({
        success: true,
        message: 'Reward redeemed successfully',
        newPoints: (pointsData.points ?? 0) - rewardData.cost,
      })
    }

    return NextResponse.json({ error: 'Invalid action' }, { status: 400 })
  } catch (error) {
    console.error('Error redeeming reward:', error)
    return NextResponse.json({ error: 'Failed to redeem reward' }, { status: 500 })
  }
}
