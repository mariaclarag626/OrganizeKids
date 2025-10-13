import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/db'
import { userPoints, users, householdMembers, profiles } from '@/db/schema'
import { eq, desc } from 'drizzle-orm'

export async function GET(request: NextRequest) {
  try {
    if (!db) {
      return NextResponse.json({ error: 'Database not connected' }, { status: 500 })
    }

    const { searchParams } = new URL(request.url)
    const householdId = searchParams.get('householdId')
    const userId = searchParams.get('userId')

    if (!householdId) {
      return NextResponse.json({ error: 'householdId is required' }, { status: 400 })
    }

    // Get all members of the household with their points
    const members = await db
      .select({
        userId: householdMembers.userId,
        role: householdMembers.role,
        userName: users.name,
        userEmail: users.email,
        points: userPoints.points,
        totalEarned: userPoints.totalEarned,
        avatar: profiles.avatar,
        displayName: profiles.displayName,
      })
      .from(householdMembers)
      .leftJoin(users, eq(householdMembers.userId, users.id))
      .leftJoin(userPoints, eq(householdMembers.userId, userPoints.userId))
      .leftJoin(profiles, eq(householdMembers.userId, profiles.userId))
      .where(eq(householdMembers.householdId, householdId))
      .orderBy(desc(userPoints.points))

    // Add position to each member
    const ranking = members.map((member, index) => ({
      ...member,
      position: index + 1,
      isCurrentUser: member.userId === userId,
      points: member.points || 0,
      totalEarned: member.totalEarned || 0,
    }))

    return NextResponse.json({ ranking })
  } catch (error) {
    console.error('Error fetching ranking:', error)
    return NextResponse.json({ error: 'Failed to fetch ranking' }, { status: 500 })
  }
}
