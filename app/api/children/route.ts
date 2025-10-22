import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

export async function GET() {
  // In a full implementation, this would query children linked to the parent
  return NextResponse.json({ ok: true, children: [] })
}

export async function POST(request: Request) {
  const body = await request.json().catch(() => ({}))
  // Acknowledge actions like join family or update parental controls
  return NextResponse.json({ ok: true, action: body?.action ?? 'none' })
}
