import { useCallback, useEffect, useRef, useState } from 'react'

export type RafOptions = {
  maxFps?: number // default 60
}

export type RafControls = {
  start: () => void
  stop: () => void
  setFpsCap: (fps: number) => void
  isRunning: boolean
  lastDeltaMs: number
}

/**
 * requestAnimationFrame loop with FPS capping and delta time.
 * SSR-safe: no window access until effects.
 */
export function useRafAnimation(
  onFrame: (deltaMs: number) => void,
  options: RafOptions = {}
): RafControls {
  const fpsCapRef = useRef(Math.max(1, Math.min(240, options.maxFps ?? 60)))
  const frameReqRef = useRef<number | null>(null)
  const runningRef = useRef(false)
  const lastTimeRef = useRef<number | null>(null)
  const accumulatorRef = useRef(0)
  const [isRunningState, setIsRunningState] = useState(false)
  const [lastDeltaMsState, setLastDeltaMsState] = useState(0)

  const tick = useCallback((t: number) => {
    if (!runningRef.current) return

    const last = lastTimeRef.current ?? t
    const delta = t - last
    lastTimeRef.current = t

    const minInterval = 1000 / fpsCapRef.current
    accumulatorRef.current += delta

    // Only emit when we have accumulated enough time for the FPS cap
    if (accumulatorRef.current >= minInterval) {
      const used = accumulatorRef.current
      accumulatorRef.current = 0
      try {
        onFrame(used)
        setLastDeltaMsState(used)
      } catch (err) {
        // Fail-safe: stop loop on unexpected error
        // eslint-disable-next-line no-console
        console.error('useRafAnimation onFrame error:', err)
        stop()
        return
      }
    }

    frameReqRef.current = requestAnimationFrame(tick)
  }, [onFrame])

  const start = useCallback(() => {
    if (runningRef.current) return
    if (typeof window === 'undefined') return
    runningRef.current = true
    setIsRunningState(true)
    lastTimeRef.current = null
    accumulatorRef.current = 0
    frameReqRef.current = requestAnimationFrame(tick)
  }, [tick])

  const stop = useCallback(() => {
    runningRef.current = false
    setIsRunningState(false)
    if (frameReqRef.current != null) {
      cancelAnimationFrame(frameReqRef.current)
      frameReqRef.current = null
    }
  }, [])

  const setFpsCap = useCallback((fps: number) => {
    fpsCapRef.current = Math.max(1, Math.min(240, Math.floor(fps)))
  }, [])

  useEffect(() => {
    return () => {
      // Cleanup on unmount
      if (frameReqRef.current != null) cancelAnimationFrame(frameReqRef.current)
      runningRef.current = false
    }
  }, [])

  return {
    start,
    stop,
    setFpsCap,
    isRunning: isRunningState,
    lastDeltaMs: lastDeltaMsState,
  }
}
