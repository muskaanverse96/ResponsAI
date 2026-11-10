import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Bot,
  X,
  Mic,
  PhoneCall,
  MapPin,
  AlertTriangle,
  ChevronRight,
  Loader2,
  ShieldCheck
} from 'lucide-react'
import { useApp } from '../../context/AppContext'

export default function CallBotPopup({ open, onClose }) {
  const navigate = useNavigate()
  const { createEmergency, notify } = useApp()

  const [step, setStep] = useState('welcome')
  const [message, setMessage] = useState('')
  const [listening, setListening] = useState(false)
  const [location, setLocation] = useState('Location not detected')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!open) {
      setStep('welcome')
      setMessage('')
      setListening(false)
      setLoading(false)
    }
  }, [open])

  if (!open) return null

  const detectLocation = () => {
    if (!navigator.geolocation) {
      setLocation('Location unavailable')
      return
    }

    setLocation('Detecting location...')

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLocation(
          `${position.coords.latitude.toFixed(4)}, ${position.coords.longitude.toFixed(4)}`
        )
      },
      () => {
        setLocation('Location permission not granted')
      }
    )
  }

  const startListening = () => {
    if (!('webkitSpeechRecognition' in window || 'SpeechRecognition' in window)) {
      setMessage('Voice input is not supported in this browser.')
      return
    }

    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition

    const recognition = new SpeechRecognition()

    recognition.lang = 'en-US'
    recognition.interimResults = false
    recognition.continuous = false

    setListening(true)

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript
      setMessage(transcript)
      setListening(false)
    }

    recognition.onerror = () => {
      setListening(false)
      setMessage('Unable to hear you. Please type your emergency.')
    }

    recognition.onend = () => {
      setListening(false)
    }

    recognition.start()
  }

  const submitEmergency = () => {
    if (!message.trim()) return

    setLoading(true)

    const result = createEmergency({
      description: message.trim(),
      location,
      source: 'AI CallBot',
      time: 'Just now'
    })

    notify(
      'AI CallBot emergency created',
      `${result.emergency.id} has been sent for AI analysis.`,
      'critical'
    )

    setTimeout(() => {
      setLoading(false)
      onClose()
      navigate(`/analysis/${result.emergency.id}`)
    }, 700)
  }

  const openFullCallBot = () => {
    onClose()
    navigate('/callbot')
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-end justify-center bg-black/50 p-4 backdrop-blur-sm sm:items-center">
      <div className="w-full max-w-md overflow-hidden rounded-3xl bg-white shadow-2xl">

        {/* Header */}
        <div className="flex items-center justify-between bg-ink px-5 py-4 text-white">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-red-500">
              <Bot size={23} />
            </div>

            <div>
              <p className="font-bold">responsAI CallBot</p>
              <div className="mt-0.5 flex items-center gap-1.5 text-xs text-emerald-300">
                <span className="h-2 w-2 rounded-full bg-emerald-400" />
                AI response assistant online
              </div>
            </div>
          </div>

          <button
            onClick={onClose}
            className="rounded-xl p-2 text-slate-300 transition hover:bg-white/10 hover:text-white"
            aria-label="Close CallBot"
          >
            <X size={20} />
          </button>
        </div>

        {/* Body */}
        <div className="p-5">

          {step === 'welcome' && (
            <>
              <div className="rounded-2xl bg-red-50 p-5">
                <div className="flex items-start gap-3">
                  <AlertTriangle
                    size={22}
                    className="mt-0.5 shrink-0 text-red-500"
                  />

                  <div>
                    <h3 className="font-bold text-ink">
                      Do you need emergency assistance?
                    </h3>

                    <p className="mt-1 text-sm leading-6 text-slate-600">
                      Tell responsAI what happened. The AI will analyze the
                      situation and help coordinate the response.
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-5 grid grid-cols-2 gap-3">

                <button
                  onClick={() => {
                    setStep('report')
                    detectLocation()
                  }}
                  className="flex items-center justify-center gap-2 rounded-2xl bg-red-500 px-4 py-4 font-bold text-white transition hover:bg-red-600"
                >
                  <PhoneCall size={18} />
                  Start emergency
                </button>

                <button
                  onClick={openFullCallBot}
                  className="flex items-center justify-center gap-2 rounded-2xl border border-slate-200 px-4 py-4 text-sm font-bold text-ink transition hover:bg-slate-50"
                >
                  Full CallBot
                  <ChevronRight size={17} />
                </button>

              </div>

              <div className="mt-5 flex items-center gap-2 text-xs text-slate-500">
                <ShieldCheck size={15} className="text-emerald-500" />
                Prototype mode — no real emergency services are contacted.
              </div>
            </>
          )}

          {step === 'report' && (
            <>
              <button
                onClick={() => setStep('welcome')}
                className="mb-4 text-xs font-semibold text-slate-500 hover:text-ink"
              >
                ← Back
              </button>

              <h3 className="text-xl font-bold text-ink">
                Tell me what happened
              </h3>

              <p className="mt-1 text-sm leading-6 text-slate-500">
                You can type your emergency or use your microphone.
              </p>

              <div className="mt-4">
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Example: A road accident happened and someone is injured..."
                  rows={4}
                  className="w-full resize-none rounded-2xl border border-slate-200 p-4 text-sm outline-none transition focus:border-red-400 focus:ring-2 focus:ring-red-100"
                />
              </div>

              <button
                onClick={startListening}
                className={`mt-3 flex w-full items-center justify-center gap-2 rounded-2xl border px-4 py-3 text-sm font-bold transition ${
                  listening
                    ? 'border-red-300 bg-red-50 text-red-600'
                    : 'border-slate-200 text-ink hover:bg-slate-50'
                }`}
              >
                <Mic size={18} />

                {listening
                  ? 'Listening... speak now'
                  : 'Speak emergency'}
              </button>

              <div className="mt-4 flex items-center gap-2 rounded-xl bg-slate-50 p-3 text-xs text-slate-500">
                <MapPin size={15} className="shrink-0 text-red-500" />
                <span className="truncate">{location}</span>

                <button
                  onClick={detectLocation}
                  className="ml-auto shrink-0 font-bold text-red-500 hover:text-red-600"
                >
                  Detect
                </button>
              </div>

              <button
                onClick={submitEmergency}
                disabled={!message.trim() || loading}
                className="btn-primary mt-5 w-full justify-center py-3.5 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {loading ? (
                  <>
                    <Loader2 size={18} className="animate-spin" />
                    AI processing...
                  </>
                ) : (
                  <>
                    <SirenIcon />
                    Analyze & coordinate
                  </>
                )}
              </button>
            </>
          )}

        </div>
      </div>
    </div>
  )
}

function SirenIcon() {
  return <AlertTriangle size={18} />
}