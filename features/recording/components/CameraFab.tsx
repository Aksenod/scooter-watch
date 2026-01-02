'use client'

import { Camera } from 'lucide-react'

type CameraFabProps = {
  onClick: () => void
  disabled?: boolean
}

export function CameraFab({ onClick, disabled }: CameraFabProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-sm transition-colors hover:bg-primary/90 disabled:pointer-events-none disabled:opacity-50"
    >
      <span className="inline-flex h-16 w-16 items-center justify-center rounded-full animate-breath">
        <Camera className="h-7 w-7" />
      </span>
    </button>
  )
}
