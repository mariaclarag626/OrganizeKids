'use client'

import React, { useEffect, useMemo, useRef, useState } from 'react'
import { useRafAnimation } from '@/hooks/useRafAnimation'

export type ShootingStarsBackgroundProps = {
  className?: string
  style?: React.CSSProperties
  ariaLabel?: string
  // Total number of stars; distributed across depth layers
  starCount?: number
  // Enable/disable meteors (shooting stars)
  meteors?: boolean
  // Cap frames-per-second to save battery/CPU
  maxFps?: number
  // Subtle mouse-based parallax strength in CSS pixels
  parallaxStrength?: number
}

// Internal types
interface Star {
  // Normalized position [0,1] to make resizing easier
  nx: number
  ny: number
  depth: number // 0=far, 1=near
  size: number // base size in px (in CSS pixels)
  baseAlpha: number
  twinkleAmp: number
  twinkleSpeed: number
  phase: number
}

interface Meteor {
  x: number
  y: number
  vx: number
  vy: number
  life: number
  ttl: number
  width: number
  brightness: number
  trail: Array<{ x: number; y: number; alpha: number }>
}

interface Spark {
  x: number
  y: number
  vx: number
  vy: number
  life: number
  ttl: number
}

function rand(min: number, max: number) {
  return Math.random() * (max - min) + min
}

function choose<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)]
}

function logNormal(mean = 0.0, sigma = 0.25) {
  // returns exp(N(mean, sigma))
  const u1 = Math.random()
  const u2 = Math.random()
  const z = Math.sqrt(-2 * Math.log(u1)) * Math.cos(2 * Math.PI * u2)
  return Math.exp(mean + sigma * z)
}

export default function ShootingStarsBackground({
  className,
  style,
  ariaLabel = 'Animated starry sky background',
  starCount = 450,
  meteors = true,
  maxFps = 60,
  parallaxStrength = 0.02,
}: ShootingStarsBackgroundProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const ctxRef = useRef<CanvasRenderingContext2D | null>(null)
  const [mounted, setMounted] = useState(false)
  const dprRef = useRef(1)

  const starsRef = useRef<Star[]>([])
  const meteorsRef = useRef<Meteor[]>([])
  const sparksRef = useRef<Spark[]>([])

  const nextSpawnAtRef = useRef<number>(0)
  const lastNowRef = useRef<number>(0)

  const reduceMotion = useMemo(() => {
    if (typeof window === 'undefined') return true
    return window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches
  }, [])

  const mouseRef = useRef({ x: 0, y: 0, has: false })

  useEffect(() => {
    setMounted(true)
  }, [])

  // Resize and setup
  useEffect(() => {
    if (!mounted) return
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return
    ctxRef.current = ctx

    const resize = () => {
      const rect = canvas.getBoundingClientRect()
      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      dprRef.current = dpr
      canvas.width = Math.max(1, Math.floor(rect.width * dpr))
      canvas.height = Math.max(1, Math.floor(rect.height * dpr))
      // Draw using CSS pixel coordinates by scaling the context
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    }

    resize()
    const ro = new ResizeObserver(resize)
    ro.observe(canvas)

    const onDprChange = () => resize()
    window.addEventListener('resize', onDprChange)

    return () => {
      ro.disconnect()
      window.removeEventListener('resize', onDprChange)
    }
  }, [mounted])

  // Initialize stars once
  useEffect(() => {
    if (!mounted) return
    const canvas = canvasRef.current
    if (!canvas) return

    const makeStars = (count: number): Star[] => {
      const stars: Star[] = []
      for (let i = 0; i < count; i++) {
        const depth = Math.pow(Math.random(), 1.5) // more far stars
        const sizeFactor = logNormal(-0.5, 0.5) // many small, few large
        const size = Math.max(0.6, Math.min(2.8, sizeFactor * (0.8 + depth * 2)))
        const baseAlpha = 0.35 + depth * 0.5 + Math.random() * 0.15
        const twinkleAmp = 0.1 + Math.random() * 0.25
        const twinkleSpeed = rand(0.3, 1.2)
        const phase = Math.random() * Math.PI * 2
        stars.push({
          nx: Math.random(),
          ny: Math.random(),
          depth,
          size,
          baseAlpha: Math.min(0.95, baseAlpha),
          twinkleAmp,
          twinkleSpeed,
          phase,
        })
      }
      return stars
    }

    starsRef.current = makeStars(starCount)
  }, [mounted, starCount])

  // Visibility pause/resume
  const { start, stop } = useRafAnimation((deltaMs) => {
    draw(deltaMs)
  }, { maxFps: maxFps })

  const visibilityHandler = React.useCallback(() => {
    if (typeof document === 'undefined') return
    if (document.visibilityState === 'hidden') {
      stop()
    } else {
      // reset spawn timer to avoid burst after tab switch
      nextSpawnAtRef.current = performance.now() + 1000
      start()
    }
  }, [start, stop])

  useEffect(() => {
    if (!mounted) return
    if (reduceMotion) {
      // Draw a single static frame
      draw(16)
      return
    }

    start()
    document.addEventListener('visibilitychange', visibilityHandler)
    return () => {
      document.removeEventListener('visibilitychange', visibilityHandler)
      stop()
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mounted, reduceMotion, maxFps])

  // Mouse parallax
  useEffect(() => {
    if (!mounted) return
    const onMouse = (e: MouseEvent) => {
      const canvas = canvasRef.current
      if (!canvas) return
      const rect = canvas.getBoundingClientRect()
      const cx = rect.left + rect.width / 2
      const cy = rect.top + rect.height / 2
      mouseRef.current.x = (e.clientX - cx) / rect.width
      mouseRef.current.y = (e.clientY - cy) / rect.height
      mouseRef.current.has = true
    }
    const onLeave = () => { mouseRef.current.has = false }
    window.addEventListener('mousemove', onMouse)
    window.addEventListener('mouseleave', onLeave)
    return () => {
      window.removeEventListener('mousemove', onMouse)
      window.removeEventListener('mouseleave', onLeave)
    }
  }, [mounted])

  function draw(deltaMs: number) {
    const canvas = canvasRef.current
    const ctx = ctxRef.current
    if (!canvas || !ctx) return

    const w = canvas.clientWidth
    const h = canvas.clientHeight

    // Reset transform each frame to be safe
    ctx.setTransform(dprRef.current, 0, 0, dprRef.current, 0, 0)

    // Clear frame (transparent to let page background show through)
    ctx.globalCompositeOperation = 'source-over'
    ctx.clearRect(0, 0, w, h)

    // Stars and halos
    const tNow = (lastNowRef.current += deltaMs)
    drawStars(ctx, w, h, tNow)

    if (meteors && !reduceMotion) {
      updateMeteors(deltaMs, w, h)
      drawMeteors(ctx)
    }
  }

  function drawStars(ctx: CanvasRenderingContext2D, w: number, h: number, tNow: number) {
    const stars = starsRef.current
    const mouse = mouseRef.current

    for (let i = 0; i < stars.length; i++) {
      const s = stars[i]
      const tw = 1 + Math.sin(s.phase + (tNow / 1000) * s.twinkleSpeed * 2 * Math.PI) * s.twinkleAmp
      const alpha = Math.max(0, Math.min(1, s.baseAlpha * tw))

      const px = s.nx * w
      const py = s.ny * h

      // Parallax offset based on depth and mouse
      const offX = mouse.has ? (mouse.x * parallaxStrength * (s.depth * 30)) : 0
      const offY = mouse.has ? (mouse.y * parallaxStrength * (s.depth * 30)) : 0
      const x = px + offX
      const y = py + offY

      // Soft glow using shadow
      ctx.save()
      ctx.globalAlpha = alpha
      ctx.fillStyle = '#fff'
      ctx.shadowColor = 'rgba(255,255,255,0.9)'
      ctx.shadowBlur = 6 * s.size
      ctx.beginPath()
      ctx.arc(x, y, s.size * (0.6 + s.depth * 0.8), 0, Math.PI * 2)
      ctx.fill()
      ctx.restore()
    }
  }

  function spawnMeteor(w: number, h: number): Meteor {
    // Enter from random top/left edge, exiting toward bottom/right with slight curvature
    const enterFromTop = Math.random() < 0.6
    const startX = enterFromTop ? rand(-0.1 * w, 1.1 * w) : rand(-0.15 * w, -0.05 * w)
    const startY = enterFromTop ? rand(-0.15 * h, -0.05 * h) : rand(0.05 * h, 0.4 * h)

    // Velocity angled down-right
    const speed = rand(350, 700) // px/sec
    const angle = rand((20 * Math.PI) / 180, (60 * Math.PI) / 180)
    const vx = Math.cos(angle) * speed
    const vy = Math.sin(angle) * speed * (enterFromTop ? 1 : rand(0.6, 1.0))

    const ttl = rand(900, 1800) // ms
    const width = rand(1.2, 2.2)
    const brightness = rand(0.6, 1.0)

    return {
      x: startX,
      y: startY,
      vx,
      vy,
      life: 0,
      ttl,
      width,
      brightness,
      trail: [],
    }
  }

  function updateMeteors(deltaMs: number, w: number, h: number) {
    const now = performance.now()
    if (nextSpawnAtRef.current === 0) {
      // Slightly sooner first meteor
      nextSpawnAtRef.current = now + rand(3000, 5000)
    }

    // Poisson-like spawning: occasionally spawn bursts of 1-3
    if (now >= nextSpawnAtRef.current) {
      const n = Math.random() < 0.7 ? 1 : Math.random() < 0.85 ? 2 : 3
      for (let i = 0; i < n; i++) {
        meteorsRef.current.push(spawnMeteor(w, h))
      }
      // Reduce time between bursts a bit
      nextSpawnAtRef.current = now + rand(6500, 10000)
    }

    // Update motion with a tiny curvature (gravity-like)
    const ms = deltaMs
    for (let i = meteorsRef.current.length - 1; i >= 0; i--) {
      const m = meteorsRef.current[i]
      m.life += ms
      const dt = ms / 1000

      // Quadratic-ish curve via gentle acceleration on vy
      m.vy += 50 * dt // px/sec^2
      m.x += m.vx * dt
      m.y += m.vy * dt

      // Record trail
      m.trail.push({ x: m.x, y: m.y, alpha: 1 })
      if (m.trail.length > 20) m.trail.shift()

      // Sparks behind the head
      const sparksToAdd = 2
      for (let s = 0; s < sparksToAdd; s++) {
        const angle = rand(Math.PI + 0.2, Math.PI + 0.9)
        const spd = rand(60, 160)
        sparksRef.current.push({
          x: m.x,
          y: m.y,
          vx: Math.cos(angle) * spd,
          vy: Math.sin(angle) * spd,
          life: 0,
          ttl: rand(250, 500),
        })
      }

      // Remove if out of bounds or expired
      if (m.life > m.ttl || m.x > w + 80 || m.y > h + 80) {
        meteorsRef.current.splice(i, 1)
      }
    }

    // Update sparks
    for (let i = sparksRef.current.length - 1; i >= 0; i--) {
      const p = sparksRef.current[i]
      const dt = ms / 1000
      p.life += ms
      p.x += p.vx * dt
      p.y += p.vy * dt
      // Fade quicker near end
      if (p.life > p.ttl) {
        sparksRef.current.splice(i, 1)
      }
    }
  }

  function drawMeteors(ctx: CanvasRenderingContext2D) {
    // Additive blending for glow/trails
    ctx.save()
    ctx.globalCompositeOperation = 'lighter'

    // Trails
    for (let i = 0; i < meteorsRef.current.length; i++) {
      const m = meteorsRef.current[i]
      const len = m.trail.length
      if (len < 2) continue

      for (let t = 1; t < len; t++) {
        const p0 = m.trail[t - 1]
        const p1 = m.trail[t]
        const alpha = (t / len) * 0.5 * m.brightness
        ctx.strokeStyle = `rgba(255, 240, 220, ${alpha})`
        ctx.lineWidth = m.width * (t / len) * 2
        ctx.beginPath()
        ctx.moveTo(p0.x, p0.y)
        ctx.lineTo(p1.x, p1.y)
        ctx.stroke()
      }

      // Head glow
      ctx.fillStyle = `rgba(255,255,255,${0.9 * m.brightness})`
      ctx.shadowColor = 'rgba(255,255,255,0.9)'
      ctx.shadowBlur = 32
      ctx.beginPath()
      ctx.arc(m.x, m.y, 2.2 + m.width * 1.5, 0, Math.PI * 2)
      ctx.fill()
      ctx.shadowBlur = 0
    }

    // Sparks
    for (let i = 0; i < sparksRef.current.length; i++) {
      const p = sparksRef.current[i]
      const lifeRatio = 1 - p.life / p.ttl
      const alpha = Math.max(0, Math.min(1, 0.35 * lifeRatio))
      ctx.fillStyle = `rgba(255, 220, 150, ${alpha})`
      ctx.beginPath()
      ctx.arc(p.x, p.y, Math.max(0.5, 1.6 * lifeRatio), 0, Math.PI * 2)
      ctx.fill()
    }

    ctx.restore()
  }

  // Render canvas element only (no children)
  return (
    <canvas
      ref={canvasRef}
      role="img"
      aria-label={ariaLabel}
      className={
        'absolute inset-0 w-full h-full block pointer-events-none select-none ' + (className ?? '')
      }
      style={{ ...style, zIndex: 0 }}
    />
  )
}
