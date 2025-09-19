// import { db } from '@/db'
// import { profiles } from '@/db/schema'
import { auth } from '@/lib/auth'
// import { eq } from 'drizzle-orm'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    const session = await auth()

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Temporarily return mock data
    const profile = {
      id: '1',
      userId: session.user.id,
      displayName: session.user.name || 'User',
      avatar: session.user.image || null,
      preferences: {},
    }

    return NextResponse.json({ profile })
  } catch (error) {
    console.error('Profile fetch error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const session = await auth()

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { displayName, dateOfBirth, preferences } = body

    // Temporarily return mock updated profile
    const updatedProfile = {
      id: '1',
      userId: session.user.id,
      displayName,
      dateOfBirth,
      preferences,
      updatedAt: new Date(),
    }

    return NextResponse.json({ profile: updatedProfile })
  } catch (error) {
    console.error('Profile update error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
