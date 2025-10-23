'use client'

import React from 'react'
import ShootingStarsBackground, { ShootingStarsBackgroundProps } from './ShootingStarsBackground'

export type ShootingStarsLayerProps = Omit<ShootingStarsBackgroundProps, 'meteors' | 'starCount' | 'maxFps'> & {
  starCount?: number
  maxFps?: number
}

/**
 * Lightweight star field (no meteors). Good for most pages.
 */
export default function ShootingStarsLayer({ starCount = 320, maxFps = 45, ...rest }: ShootingStarsLayerProps) {
  return (
    <ShootingStarsBackground
      {...rest}
      starCount={starCount}
      maxFps={maxFps}
      meteors={false}
    />
  )
}
