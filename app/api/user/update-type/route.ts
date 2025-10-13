import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/db'
import { users } from '@/db/schema'
import { eq } from 'drizzle-orm'

export async function POST(request: NextRequest) {
  try {
    const { email, userType } = await request.json()

    if (!db) {
      return NextResponse.json({ error: 'Database not connected' }, { status: 500 })
    }

    if (!email || !userType) {
      return NextResponse.json({ error: 'Email and userType required' }, { status: 400 })
    }

    // Atualizar o userType do usuário
    const [updatedUser] = await db
      .update(users)
      .set({ 
        userType,
        updatedAt: new Date(),
      })
      .where(eq(users.email, email))
      .returning()

    if (!updatedUser) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    return NextResponse.json({
      success: true,
      user: updatedUser,
    })
  } catch (error) {
    console.error('Update user type error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
