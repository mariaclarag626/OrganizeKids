import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/db'
import { households, householdMembers, users } from '@/db/schema'
import { eq } from 'drizzle-orm'
import { randomBytes } from 'crypto'

// Gerar código único para criança
function generateChildCode(): string {
  const timestamp = Date.now().toString(36).toUpperCase()
  const random = randomBytes(3).toString('hex').toUpperCase()
  return `PLANET-${timestamp}-${random}`
}

export async function POST(request: NextRequest) {
  try {
    if (!db) {
      return NextResponse.json({ error: 'Database not available' }, { status: 503 })
    }

    const body = await request.json()
    const { action, userId, householdId, childName, gender, memberData } = body

    switch (action) {
      case 'create': {
        // Criar nova família
        if (!userId) {
          return NextResponse.json({ error: 'User ID required' }, { status: 400 })
        }

        const [household] = await db.insert(households).values({
          name: body.name || 'Minha Família',
          description: body.description || '',
          createdBy: userId,
        }).returning()

        // Adicionar criador como membro (parent)
        await db.insert(householdMembers).values({
          householdId: household.id,
          userId: userId,
          role: 'parent',
        })

        return NextResponse.json({ success: true, household })
      }

      case 'get': {
        // Buscar família do usuário
        if (!userId) {
          return NextResponse.json({ error: 'User ID required' }, { status: 400 })
        }

        const [memberData] = await db
          .select()
          .from(householdMembers)
          .where(eq(householdMembers.userId, userId))
          .leftJoin(households, eq(householdMembers.householdId, households.id))
          .limit(1)

        if (!memberData || !memberData.households) {
          return NextResponse.json({ household: null })
        }

        return NextResponse.json({ household: memberData.households })
      }

      case 'get-members': {
        // Buscar todos os membros da família
        if (!householdId) {
          return NextResponse.json({ error: 'Household ID required' }, { status: 400 })
        }

        // Buscar membros usando select em vez de query
        const members = await db
          .select()
          .from(householdMembers)
          .where(eq(householdMembers.householdId, householdId))
          .leftJoin(users, eq(householdMembers.userId, users.id))

        return NextResponse.json({ success: true, members })
      }

      case 'add-child': {
        // Adicionar criança à família (gera código)
        if (!householdId || !childName) {
          return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
        }

        const code = generateChildCode()
        const expiresAt = new Date()
        expiresAt.setDate(expiresAt.getDate() + 7) // Código expira em 7 dias

        // Criar usuário temporário para a criança
        const [childUser] = await db.insert(users).values({
          email: `${code}@temp.organizekids.com`, // Email temporário
          name: childName,
          userType: 'kids',
        }).returning()

        // Adicionar como membro da família
        const [member] = await db.insert(householdMembers).values({
          householdId: householdId,
          userId: childUser.id,
          role: 'child',
        }).returning()

        return NextResponse.json({ 
          success: true, 
          child: {
            ...member,
            user: childUser,
            code: code,
            expiresAt: expiresAt,
            gender: gender || 'child',
          }
        })
      }

      case 'regenerate-code': {
        // Regenerar código de acesso
        const newCode = generateChildCode()
        const expiresAt = new Date()
        expiresAt.setDate(expiresAt.getDate() + 7)

        return NextResponse.json({ 
          success: true, 
          code: newCode,
          expiresAt: expiresAt
        })
      }

      default:
        return NextResponse.json({ error: 'Invalid action' }, { status: 400 })
    }
  } catch (error) {
    console.error('Household API Error:', error)
    return NextResponse.json({ 
      error: 'Internal server error',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}

export async function GET(request: NextRequest) {
  try {
    if (!db) {
      return NextResponse.json({ error: 'Database not available' }, { status: 503 })
    }

    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')

    if (!userId) {
      return NextResponse.json({ error: 'User ID required' }, { status: 400 })
    }

    // Buscar família do usuário
    const memberData = await db
      .select()
      .from(householdMembers)
      .where(eq(householdMembers.userId, userId))
      .leftJoin(households, eq(householdMembers.householdId, households.id))
      .limit(1)

    if (!memberData || memberData.length === 0 || !memberData[0].households) {
      return NextResponse.json({ household: null })
    }

    return NextResponse.json({ household: memberData[0].households })
  } catch (error) {
    console.error('Household GET Error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
