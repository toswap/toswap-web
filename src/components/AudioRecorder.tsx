import { useEffect, useRef, useState } from 'react'

interface Props {
  isRecording: boolean
  onStop: (blob: Blob) => void
}

export default function AudioRecorder({ isRecording, onStop }: Props) {
  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const chunksRef = useRef<Blob[]>([])
  const onStopRef = useRef(onStop)
  onStopRef.current = onStop

  const [bars, setBars] = useState<number[]>([4, 4, 4, 4, 4])
  const animFrameRef = useRef<number>()
  const streamRef = useRef<MediaStream>()
  const ctxRef = useRef<AudioContext>()

  useEffect(() => {
    if (!isRecording) {
      // isRecording이 false가 되면 진행 중인 녹음을 종료
      // stop() 호출 → onstop 이벤트 → onStop(blob) 순서로 비동기 처리
      if (mediaRecorderRef.current?.state === 'recording') {
        mediaRecorderRef.current.stop()
      }
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current)
      streamRef.current?.getTracks().forEach(t => t.stop())
      setBars([4, 4, 4, 4, 4])
      return
    }

    let cancelled = false

    navigator.mediaDevices.getUserMedia({ audio: true }).then(stream => {
      if (cancelled) {
        stream.getTracks().forEach(t => t.stop())
        return
      }
      streamRef.current = stream

      const ctx = new AudioContext()
      ctxRef.current = ctx
      const source = ctx.createMediaStreamSource(stream)
      const analyser = ctx.createAnalyser()
      analyser.fftSize = 128
      source.connect(analyser)

      const tick = () => {
        if (cancelled) return
        const data = new Uint8Array(analyser.frequencyBinCount)
        analyser.getByteFrequencyData(data)
        const avg = data.reduce((a, b) => a + b, 0) / data.length
        const level = Math.min(avg / 60, 1)
        // 각 바에 약간의 오프셋을 주어 파형처럼 보이게
        setBars([0, 1, 2, 3, 4].map(i => {
          const offset = Math.sin(Date.now() / 150 + i * 1.2) * 0.3
          return Math.max(4, (level + offset) * 36)
        }))
        animFrameRef.current = requestAnimationFrame(tick)
      }
      tick()

      const mimeType = MediaRecorder.isTypeSupported('audio/webm;codecs=opus')
        ? 'audio/webm;codecs=opus'
        : MediaRecorder.isTypeSupported('audio/webm')
        ? 'audio/webm'
        : ''

      chunksRef.current = []
      const mr = new MediaRecorder(stream, mimeType ? { mimeType } : undefined)
      mr.ondataavailable = e => { if (e.data.size > 0) chunksRef.current.push(e.data) }
      mr.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: mimeType || 'audio/webm' })
        onStopRef.current(blob)
        ctx.close()
      }
      mr.start()
      mediaRecorderRef.current = mr
    }).catch(() => {
      if (!cancelled) onStopRef.current(new Blob([], { type: 'audio/webm' }))
    })

    return () => {
      cancelled = true
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current)
    }
  }, [isRecording])

  return (
    <div className="flex items-end justify-center gap-1 h-10" aria-label="녹음 파형">
      {bars.map((h, i) => (
        <div
          key={i}
          className="w-1.5 rounded-full bg-red-500 transition-all duration-75"
          style={{ height: `${h}px` }}
        />
      ))}
    </div>
  )
}
