
import React, { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  PhoneCall,
  Mic,
  MicOff,
  Volume2,
  Square,
  Bot,
  Loader2,
  Zap,
  HeartPulse,
  Wind,
  Droplets,
  MapPin,
  AlertTriangle,
} from 'lucide-react'

import { useApp } from '../context/AppContext.jsx'
import { analyzeEmergency } from '../services/aiService.js'

const CALL_SCRIPT = [
  {
    key: 'location',
    say: 'Emergency line connected. First, please tell me the location of the emergency.',
  },
  {
    key: 'casualties',
    say: 'Thank you. How many people are injured, and are they conscious and breathing?',
  },
  {
    key: 'bleeding',
    say: 'Is there any bleeding that emergency responders should know about?',
  },
  {
    key: 'final',
    say: 'Thank you. I have enough information to prepare the emergency response. Please stay safe while help is coordinated.',
  },
]

const CHIPS = {
  location: [
    'Highway Junction',
    'Green Park Apartments',
    'Near City Mall',
  ],
  casualties: [
    'Conscious and breathing',
    'Unconscious but breathing',
    'Not breathing',
    'One person injured',
    'Multiple people injured',
  ],
  bleeding: [
    'Yes, severe bleeding',
    'Minor bleeding',
    'No bleeding',
  ],
}

export default function CallBot() {
  const { createEmergency, notify } = useApp()
  const navigate = useNavigate()

  const [phase, setPhase] = useState('idle')
  const [step, setStep] = useState(0)
  const [transcript, setTranscript] = useState([])
  const [muted, setMuted] = useState(false)
  const [speaking, setSpeaking] = useState(false)
  const [seconds, setSeconds] = useState(0)

  const [vitals, setVitals] = useState({
    location: 'Unknown',
    casualties: 'Unknown',
    consciousness: 'Unknown',
    bleeding: 'Unknown',
  })

  const scrollRef = useRef(null)
  const voicesRef = useRef([])

  useEffect(() => {
    if (window.speechSynthesis) {
      voicesRef.current = window.speechSynthesis.getVoices()

      window.speechSynthesis.onvoiceschanged = () => {
        voicesRef.current = window.speechSynthesis.getVoices()
      }
    }

    return () => {
      window.speechSynthesis?.cancel()
    }
  }, [])

  useEffect(() => {
    scrollRef.current?.scrollTo({
      top: scrollRef.current.scrollHeight,
      behavior: 'smooth',
    })
  }, [transcript])

  useEffect(() => {
    if (phase !== 'live') return

    const interval = setInterval(() => {
      setSeconds((current) => current + 1)
    }, 1000)

    return () => clearInterval(interval)
  }, [phase])

  const speak = (text, onEnd) => {
    if (muted || !window.speechSynthesis) {
      setSpeaking(true)

      setTimeout(() => {
        setSpeaking(false)
        onEnd?.()
      }, Math.min(4000, 900 + text.length * 35))

      return
    }

    window.speechSynthesis.cancel()

    const utterance = new SpeechSynthesisUtterance(text)
    utterance.rate = 1.02

    const voice =
      voicesRef.current.find((item) =>
        /en[-_](IN|GB|US)/i.test(item.lang)
      ) || voicesRef.current[0]

    if (voice) {
      utterance.voice = voice
    }

    utterance.onstart = () => setSpeaking(true)

    utterance.onend = () => {
      setSpeaking(false)
      onEnd?.()
    }

    utterance.onerror = () => {
      setSpeaking(false)
      onEnd?.()
    }

    window.speechSynthesis.speak(utterance)
  }

  const start = () => {
    setPhase('connecting')
    setSeconds(0)
    setStep(0)
    setTranscript([])
    setVitals({
      location: 'Unknown',
      casualties: 'Unknown',
      consciousness: 'Unknown',
      bleeding: 'Unknown',
    })

    setTimeout(() => {
      setPhase('live')

      const first = CALL_SCRIPT[0]

      setTranscript([
        {
          from: 'ai',
          text: first.say,
        },
      ])

      speak(first.say)
    }, 1200)
  }

  const answer = (text) => {
    if (phase !== 'live' || speaking) return

    window.speechSynthesis?.cancel()
    setSpeaking(false)

    const currentQuestion = CALL_SCRIPT[step]

    setTranscript((current) => [
      ...current,
      {
        from: 'user',
        text,
      },
    ])

    setVitals((current) => {
      const updated = { ...current }

      if (currentQuestion.key === 'location') {
        updated.location = text
      }

      if (currentQuestion.key === 'casualties') {
        updated.casualties = /multiple/i.test(text)
          ? 'Multiple'
          : '1 person'

        updated.consciousness = /unconscious/i.test(text)
          ? 'Unconscious — breathing'
          : /not breathing/i.test(text)
            ? 'Not breathing'
            : 'Conscious'
      }

      if (currentQuestion.key === 'bleeding') {
        updated.bleeding = /severe/i.test(text)
          ? 'Severe'
          : /minor/i.test(text)
            ? 'Minor'
            : 'None'
      }

      return updated
    })

    const nextStep = step + 1

    if (nextStep < CALL_SCRIPT.length) {
      setStep(nextStep)

      const nextLine = CALL_SCRIPT[nextStep]

      setTimeout(() => {
        setTranscript((current) => [
          ...current,
          {
            from: 'ai',
            text: nextLine.say,
          },
        ])

        speak(nextLine.say)
      }, 500)
    } else {
      setTimeout(() => {
        setPhase('ended')
      }, 800)
    }
  }

  const userText = transcript
    .filter((item) => item.from === 'user')
    .map((item) => item.text)
    .join('. ')

  const analysis = analyzeEmergency({
    text: `
      ${userText}.
      Location: ${vitals.location}.
      Casualties: ${vitals.casualties}.
      Consciousness: ${vitals.consciousness}.
      Bleeding: ${vitals.bleeding}.
    `,
  })

  const severityClass =
    analysis.severity === 'Critical'
      ? 'text-red-400'
      : analysis.severity === 'High'
        ? 'text-orange-400'
        : 'text-yellow-300'

  const formatTime = (value) => {
    return `${String(Math.floor(value / 60)).padStart(2, '0')}:${String(
      value % 60
    ).padStart(2, '0')}`
  }

  const dispatchNow = () => {
    const result = createEmergency({
      description:
        `Emergency reported through the AI Emergency Call Bot. ` +
        `Details: ${userText || 'Emergency details gathered by AI call bot'}. ` +
        `Location: ${vitals.location}. ` +
        `Casualties: ${vitals.casualties}. ` +
        `Consciousness: ${vitals.consciousness}. ` +
        `Bleeding: ${vitals.bleeding}.`,

      location: vitals.location,
      source: 'AI Emergency Call Bot',
      time: 'Just now',
    })

    if (!result?.emergency) {
      notify(
        'Emergency creation failed',
        'The demo could not create the emergency record.',
        'critical'
      )
      return
    }

    notify(
      'Emergency dispatched',
      `${result.emergency.id} has been added to the response network.`,
      'critical'
    )

    navigate(`/analysis/${result.emergency.id}`)
  }

  const reviewReport = () => {
    navigate('/report', {
      state: {
        prefill: {
          description: userText,
          location: vitals.location,
        },
      },
    })
  }

  const endCall = () => {
    window.speechSynthesis?.cancel()
    setSpeaking(false)
    setPhase('ended')
  }

  return (
    <div className="animate-fadeUp mx-auto max-w-5xl">

      {/* HEADER */}
      <div className="mb-5 text-center">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-cyan-500/10 text-cyan-400">
          <PhoneCall size={22} />
        </div>

        <h1 className="mt-3 font-display text-2xl font-bold text-white">
          AI Emergency Call Bot
        </h1>

        <p className="mt-1 text-sm text-slate-400">
          A guided voice call that gathers critical emergency
          information and prepares the response workflow.
        </p>
      </div>

      <div className="grid gap-5 lg:grid-cols-[1.2fr_1fr]">

        {/* CALL PANEL */}
        <div className="overflow-hidden rounded-2xl border border-slate-800 bg-slate-900/70">

          {/* CALL HEADER */}
          <div
            className={`flex items-center gap-4 border-b border-slate-800 px-5 py-4 ${
              phase === 'live' ? 'bg-red-500/5' : ''
            }`}
          >
            <div className="relative">
              <span
                className={`flex h-14 w-14 items-center justify-center rounded-2xl ${
                  phase === 'live'
                    ? 'bg-red-500/20 text-red-400'
                    : 'bg-slate-800 text-slate-400'
                }`}
              >
                {phase === 'connecting' ? (
                  <Loader2 size={24} className="animate-spin" />
                ) : (
                  <Bot size={24} />
                )}
              </span>

              {phase === 'live' && (
                <span className="absolute inset-0 animate-pulse rounded-2xl border-2 border-red-500/50" />
              )}
            </div>

            <div className="flex-1">
              <p className="font-semibold text-white">
                responsAI Emergency Line
              </p>

              <p className="text-xs">
                {phase === 'idle' && (
                  <span className="text-slate-500">Ready to connect</span>
                )}

                {phase === 'connecting' && (
                  <span className="animate-pulse text-yellow-300">
                    Connecting to AI dispatcher...
                  </span>
                )}

                {phase === 'live' && (
                  <span className="text-red-300">
                    ● LIVE CALL · {formatTime(seconds)}
                  </span>
                )}

                {phase === 'ended' && (
                  <span className="text-emerald-400">
                    Call ended · report ready
                  </span>
                )}
              </p>
            </div>

            {phase === 'live' && (
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setMuted((current) => !current)}
                  className="rounded-xl border border-slate-700 bg-slate-800 p-2.5 text-slate-300 transition hover:text-cyan-300"
                  title={muted ? 'Enable sound' : 'Mute sound'}
                >
                  {muted ? <MicOff size={16} /> : <Volume2 size={16} />}
                </button>

                <button
                  type="button"
                  onClick={endCall}
                  className="rounded-xl bg-red-500 p-2.5 text-white transition hover:bg-red-400"
                  title="End call"
                >
                  <Square size={16} />
                </button>
              </div>
            )}
          </div>

          {/* TRANSCRIPT */}
          <div
            ref={scrollRef}
            className="h-80 space-y-3 overflow-y-auto p-5"
          >
            {transcript.length === 0 && phase === 'idle' && (
              <div className="flex h-full flex-col items-center justify-center text-center">
                <PhoneCall size={30} className="text-slate-600" />

                <p className="mt-3 text-sm text-slate-500">
                  Start the emergency call to begin AI-guided triage.
                </p>
              </div>
            )}

            {transcript.map((item, index) => (
              <div
                key={index}
                className={`flex gap-2.5 ${
                  item.from === 'user' ? 'justify-end' : ''
                }`}
              >
                {item.from === 'ai' && (
                  <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-cyan-500/15 text-cyan-300">
                    <Bot size={14} />
                  </span>
                )}

                <div
                  className={`max-w-[80%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed ${
                    item.from === 'user'
                      ? 'rounded-br-md bg-gradient-to-br from-cyan-600 to-blue-600 text-white'
                      : 'rounded-bl-md border border-slate-700 bg-slate-800/80 text-slate-200'
                  }`}
                >
                  {item.text}
                </div>
              </div>
            ))}

            {speaking && phase === 'live' && (
              <p className="flex items-center gap-2 text-xs text-cyan-300">
                <span className="flex gap-0.5">
                  {[0, 1, 2].map((index) => (
                    <span
                      key={index}
                      className="h-3 w-1 animate-pulse rounded bg-cyan-400"
                    />
                  ))}
                </span>
                AI is speaking...
              </p>
            )}
          </div>

          {/* CONTROLS */}
          <div className="border-t border-slate-800 p-4">

            {phase === 'idle' && (
              <button
                type="button"
                onClick={start}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-red-500 px-4 py-3.5 text-base font-bold text-white transition hover:bg-red-400"
              >
                <PhoneCall size={17} />
                Start Emergency Call
              </button>
            )}

            {phase === 'connecting' && (
              <button
                type="button"
                disabled
                className="flex w-full items-center justify-center gap-2 rounded-xl border border-slate-700 bg-slate-800 px-4 py-3 text-sm font-semibold text-slate-300"
              >
                <Loader2 size={16} className="animate-spin" />
                Connecting...
              </button>
            )}

            {phase === 'live' && (
              <div className="space-y-2">
                {(CHIPS[CALL_SCRIPT[step]?.key] || []).map((choice) => (
                  <button
                    type="button"
                    key={choice}
                    onClick={() => answer(choice)}
                    disabled={speaking}
                    className="flex w-full items-center justify-start rounded-xl border border-slate-700 bg-slate-800/70 px-4 py-2.5 text-xs font-medium text-slate-300 transition hover:border-cyan-500/50 hover:bg-slate-800 disabled:opacity-40"
                  >
                    {choice}
                  </button>
                ))}

                {!CHIPS[CALL_SCRIPT[step]?.key] && (
                  <p className="text-center text-xs text-slate-500">
                    AI is preparing the response workflow...
                  </p>
                )}
              </div>
            )}

            {phase === 'ended' && (
              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={dispatchNow}
                  className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-red-500 px-3 py-3 text-xs font-bold text-white transition hover:bg-red-400"
                >
                  <Zap size={14} />
                  Dispatch Immediately
                </button>

                <button
                  type="button"
                  onClick={reviewReport}
                  className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-cyan-500 px-3 py-3 text-xs font-bold text-slate-950 transition hover:bg-cyan-400"
                >
                  <Mic size={14} />
                  Review in Report Form
                </button>
              </div>
            )}
          </div>
        </div>

        {/* RIGHT PANEL */}
        <div className="space-y-5">

          {/* TRIAGE */}
          <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-5">
            <div className="flex items-center gap-2">
              <HeartPulse size={17} className="text-red-400" />
              <h3 className="text-sm font-semibold text-white">
                Live AI Triage Assessment
              </h3>
            </div>

            <div className="mt-4 flex items-center gap-3 rounded-xl border border-slate-700 bg-slate-800/70 p-4">
              {analysis.type === 'Fire' ? (
                <Wind size={22} className="text-orange-400" />
              ) : analysis.type === 'Flood' ? (
                <Droplets size={22} className="text-sky-400" />
              ) : (
                <HeartPulse size={22} className="text-emerald-400" />
              )}

              <div className="min-w-0 flex-1">
                <p className="font-semibold text-white">
                  {analysis.type}
                </p>

                <p className={`text-xs font-semibold ${severityClass}`}>
                  Severity: {analysis.severity}
                  {analysis.priority ? ` · ${analysis.priority}` : ''}
                </p>
              </div>

              <span className="font-display text-lg font-bold text-cyan-300">
                {analysis.confidence}%
              </span>
            </div>

            {/* VITALS */}
            <div className="mt-4 grid grid-cols-2 gap-2.5 text-xs">
              {[
                ['Location', vitals.location],
                ['Casualties', vitals.casualties],
                ['Consciousness', vitals.consciousness],
                ['Bleeding', vitals.bleeding],
              ].map(([label, value]) => (
                <div
                  key={label}
                  className="rounded-xl bg-slate-800/70 px-3.5 py-2.5"
                >
                  <p className="text-[9px] uppercase tracking-wider text-slate-500">
                    {label}
                  </p>

                  <p className="mt-0.5 font-medium text-slate-200">
                    {value}
                  </p>
                </div>
              ))}
            </div>

            <p className="mt-3 rounded-xl border border-yellow-500/20 bg-yellow-500/5 px-3.5 py-2.5 text-[10px] leading-relaxed text-yellow-200/80">
              Simulated AI assessment for demonstration purposes.
              This is not a medical diagnosis.
            </p>
          </div>

          {/* LOCATION */}
          <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-5">
            <div className="flex items-center gap-2">
              <MapPin size={17} className="text-cyan-400" />
              <h3 className="text-sm font-semibold text-white">
                Emergency Location
              </h3>
            </div>

            <div className="mt-3 rounded-xl border border-slate-700 bg-slate-800/70 p-4">
              <p className="text-[10px] uppercase tracking-wider text-slate-500">
                Current location
              </p>

              <p className="mt-1 text-sm font-medium text-slate-200">
                {vitals.location}
              </p>
            </div>
          </div>

          {/* BACKGROUND ACTIONS */}
          <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-5">
            <h3 className="text-sm font-semibold text-white">
              While You Talk, AI Already:
            </h3>

            <ul className="mt-3 space-y-2 text-xs text-slate-400">
              {[
                'Opened a live incident channel',
                'Prepared ambulance matching',
                'Pre-checked hospital availability',
                'Prepared family notification',
              ].map((item) => (
                <li key={item} className="flex items-center gap-2">
                  <span className="flex h-4 w-4 items-center justify-center rounded-full bg-green-500/20 text-[9px] text-green-400">
                    ✓
                  </span>
                  {item}
                </li>
              ))}
            </ul>

            <button
              type="button"
              onClick={() => navigate('/report')}
              className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl border border-slate-700 bg-slate-800 px-3 py-2 text-xs font-semibold text-slate-300 transition hover:border-cyan-500/50 hover:text-cyan-400"
            >
              <Mic size={13} />
              Prefer text / voice report instead?
            </button>
          </div>

          {/* SAFETY NOTE */}
          <div className="rounded-xl border border-yellow-500/20 bg-yellow-500/5 p-4">
            <div className="flex gap-2">
              <AlertTriangle
                size={15}
                className="mt-0.5 shrink-0 text-yellow-400"
              />

              <p className="text-[10px] leading-relaxed text-yellow-200/70">
                This call bot is a prototype demonstration.
                In a real deployment, emergency calls should
                connect to authorized emergency response services.
              </p>
            </div>
          </div>

        </div>
      </div>
    </div>
  )
}
