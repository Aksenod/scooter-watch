'use client'

import { useState } from 'react'
import { Button, Badge } from '@/shared/ui'
import { ChevronDown, Check, Pencil } from 'lucide-react'
import { REPORT_CONSTANTS } from '@/features/reports/constants'
import { cn } from '@/lib/utils'

interface ViolationTypeSelectorProps {
  value: string
  onChange: (value: string) => void
  disabled?: boolean
  className?: string
}

const violationOptions = Object.entries(REPORT_CONSTANTS.VIOLATION_LABELS).map(([key, label]) => ({
  value: key,
  label,
}))

export function ViolationTypeSelector({
  value,
  onChange,
  disabled = false,
  className,
}: ViolationTypeSelectorProps) {
  const [isOpen, setIsOpen] = useState(false)

  const currentLabel = REPORT_CONSTANTS.VIOLATION_LABELS[value as keyof typeof REPORT_CONSTANTS.VIOLATION_LABELS] || value

  const handleSelect = (newValue: string) => {
    onChange(newValue)
    setIsOpen(false)
  }

  return (
    <div className={cn('relative', className)}>
      <div className="flex items-center gap-2">
        <p className="font-semibold">{currentLabel}</p>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setIsOpen(!isOpen)}
          disabled={disabled}
          className="h-7 px-2 text-muted-foreground hover:text-foreground"
        >
          <Pencil className="w-4 h-4 mr-1" />
          Изменить
        </Button>
      </div>

      {isOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-10"
            onClick={() => setIsOpen(false)}
          />

          {/* Dropdown */}
          <div className="absolute left-0 top-full mt-2 z-20 w-64 rounded-lg border bg-card shadow-lg">
            <div className="p-2">
              <p className="px-2 py-1 text-xs text-muted-foreground font-medium">
                Выберите тип нарушения:
              </p>
              {violationOptions.map((option) => (
                <button
                  key={option.value}
                  onClick={() => handleSelect(option.value)}
                  className={cn(
                    'flex w-full items-center justify-between rounded-md px-2 py-2 text-sm transition-colors',
                    'hover:bg-muted',
                    option.value === value && 'bg-primary/10 text-primary'
                  )}
                >
                  <span>{option.label}</span>
                  {option.value === value && (
                    <Check className="w-4 h-4 text-primary" />
                  )}
                </button>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  )
}
