import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/db/client'
import { taskSuggestions } from '@/db/schema'

export async function POST(request: NextRequest) {
  try {
    if (!db) {
      return NextResponse.json(
        { error: 'Database not configured' },
        { status: 500 }
      )
    }

    const body = await request.json()
    const { householdId, userId, title, description, pointsSuggested } = body

    // Validate required fields
    if (!householdId || !userId || !title) {
      return NextResponse.json(
        { error: 'Missing required fields: householdId, userId, title' },
        { status: 400 }
      )
    }

    // Create task suggestion
    const [suggestion] = await db.insert(taskSuggestions).values({
      householdId,
      suggestedBy: userId,
      title,
      description: description || '',
      pointsSuggested: pointsSuggested || 10,
      status: 'pending',
    }).returning()

    return NextResponse.json({
      success: true,
      suggestion,
      message: 'Sugestão enviada com sucesso!'
    })
  } catch (error) {
    console.error('Error creating task suggestion:', error)
    return NextResponse.json(
      { error: 'Failed to create task suggestion' },
      { status: 500 }
    )
  }
}

// Get suggestions for a household
export async function GET(request: NextRequest) {
  try {
    if (!db) {
      return NextResponse.json(
        { error: 'Database not configured' },
        { status: 500 }
      )
    }

    const { searchParams } = new URL(request.url)
    const householdId = searchParams.get('householdId')
    const status = searchParams.get('status') || 'pending'

    if (!householdId) {
      return NextResponse.json(
        { error: 'householdId parameter is required' },
        { status: 400 }
      )
    }

    // TODO: Query suggestions from database
    // For now, return empty array
    const suggestions: any[] = []

    return NextResponse.json({ suggestions })
  } catch (error) {
    console.error('Error fetching task suggestions:', error)
    return NextResponse.json(
      { error: 'Failed to fetch task suggestions' },
      { status: 500 }
    )
  }
}
