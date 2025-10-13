import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/db'
import { avatarCustomizations } from '@/db/schema'
import { eq } from 'drizzle-orm'

export async function GET(request: NextRequest) {
  try {
    if (!db) {
      return NextResponse.json({ error: 'Database not connected' }, { status: 500 })
    }

    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')

    if (!userId) {
      return NextResponse.json({ error: 'userId is required' }, { status: 400 })
    }

    const avatar = await db
      .select()
      .from(avatarCustomizations)
      .where(eq(avatarCustomizations.userId, userId))
      .limit(1)

    return NextResponse.json({
      avatar: avatar[0] || null,
    })
  } catch (error) {
    console.error('Error fetching avatar:', error)
    return NextResponse.json({ error: 'Failed to fetch avatar' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    if (!db) {
      return NextResponse.json({ error: 'Database not connected' }, { status: 500 })
    }

    const body = await request.json()
    const { userId, ...customizations } = body

    if (!userId) {
      return NextResponse.json({ error: 'userId is required' }, { status: 400 })
    }

    // Check if avatar exists
    const existing = await db
      .select()
      .from(avatarCustomizations)
      .where(eq(avatarCustomizations.userId, userId))
      .limit(1)

    if (existing.length > 0) {
      // Update existing avatar
      await db
        .update(avatarCustomizations)
        .set({
          ...customizations,
          updatedAt: new Date(),
        })
        .where(eq(avatarCustomizations.userId, userId))
    } else {
      // Create new avatar
      await db.insert(avatarCustomizations).values({
        userId,
        ...customizations,
      })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error saving avatar:', error)
    return NextResponse.json({ error: 'Failed to save avatar' }, { status: 500 })
  }
}
