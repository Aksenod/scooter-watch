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
      className="inline-flex h-20 w-20 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-[0_8px_16px_rgba(0,0,0,0.24)] transition-colors hover:bg-primary/90 disabled:pointer-events-none disabled:opacity-50"
    >
      <span className="inline-flex h-20 w-20 items-center justify-center rounded-full animate-breath">
        <Camera className="h-7 w-7" />
      </span>
    </button>
  )
}
