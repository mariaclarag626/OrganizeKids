import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

export async function POST(request: Request) {
  // This endpoint acknowledges profile updates for client-side persistence
  const body = await request.json().catch(() => ({}))
  return NextResponse.json({ ok: true, received: body })
}
