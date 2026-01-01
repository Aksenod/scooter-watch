'use client'

import { useCallback, useRef, useState } from 'react'

export function useRecord() {
  const [isRecording, setIsRecording] = useState(false)
  const [blob, setBlob] = useState<Blob | null>(null)

  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const streamRef = useRef<MediaStream | null>(null)

  const start = useCallback(async () => {
    const stream = await navigator.mediaDevices.getUserMedia({
      video: { facingMode: 'environment' },
      audio: true,
    })

    streamRef.current = stream

    const mr = new MediaRecorder(stream)
    const chunks: Blob[] = []

    mr.ondataavailable = (e) => {
      if (e.data.size > 0) chunks.push(e.data)
    }
    mr.onstop = () => {
      setBlob(new Blob(chunks, { type: 'video/webm' }))
      stream.getTracks().forEach((t) => t.stop())
    }

    mediaRecorderRef.current = mr
    mr.start()
    setIsRecording(true)
  }, [])

  const stop = useCallback(() => {
    if (!mediaRecorderRef.current) return
    mediaRecorderRef.current.stop()
    setIsRecording(false)
  }, [])

  return { isRecording, blob, start, stop }
}
