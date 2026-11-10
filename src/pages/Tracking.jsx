import React, { useEffect, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import {
  MapPin,
  Clock,
  Users,
  Check,
  RefreshCw,
  ShieldAlert,
  Navigation,
  Phone,
  Ambulance,
  Hospital,
  Activity,
} from 'lucide-react'

import { useApp } from '../context/AppContext'

const JOURNEY_SECONDS = 30

function formatTime(seconds) {
  const m = Math.floor(seconds / 60)
  const s = Math.floor(seconds % 60)

  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`
}

export default function Tracking() {
  const {
    emergencies,
    ambulances,
    hospitals,
    updateEmergency,
    advanceEmergency,
    notify,
  } = useApp()

  const [params] = useSearchParams()
  const navigate = useNavigate()

  const emergencyId = params.get('em')

  const [phase, setPhase] = useState('enroute')
  const [progress, setProgress] = useState(0)
  const [familyNotified, setFamilyNotified] = useState(false)

  const emergency =
    emergencies.find((item) => item.id === emergencyId) ||
    emergencies[0]

  const ambulance = emergency
    ? ambulances.find((item) => item.id === emergency.ambulanceId)
    : null

  const hospital = emergency
    ? hospitals.find((item) => item.id === emergency.hospitalId)
    : null

  // --------------------------------------------------
  // LIVE JOURNEY SIMULATION
  // --------------------------------------------------

  useEffect(() => {
    if (!emergency || phase !== 'enroute') return

    const startTime = Date.now()

    const interval = setInterval(() => {
      const elapsed = (Date.now() - startTime) / 1000
      const value = Math.min(1, elapsed / JOURNEY_SECONDS)

      setProgress(value)

      if (value >= 1) {
        clearInterval(interval)
        setPhase('arrived')
      }
    }, 500)

    return () => clearInterval(interval)
  }, [emergency, phase])

  // --------------------------------------------------
  // ARRIVED
  // --------------------------------------------------

  useEffect(() => {
    if (!emergency) return

    if (phase === 'arrived') {
      updateEmergency(
        emergency.id,
        {
          status: 'At Hospital',
          timeline: [
            ...(emergency.timeline || []),
            'Ambulance arrived at hospital',
          ],
        },
        {
          title: 'Ambulance arrived',
          message: `${emergency.id} has arrived at the destination hospital.`,
          kind: 'info',
        }
      )

      const timer = setTimeout(() => {
        setPhase('handover')
      }, 5000)

      return () => clearTimeout(timer)
    }

    if (phase === 'handover') {
      updateEmergency(
        emergency.id,
        {
          status: 'Patient Handover',
          timeline: [
            ...(emergency.timeline || []),
            'Patient handover started',
          ],
        },
        {
          title: 'Patient handover',
          message: 'Hospital staff are receiving the patient.',
          kind: 'info',
        }
      )

      const timer = setTimeout(() => {
        setPhase('completed')
      }, 5000)

      return () => clearTimeout(timer)
    }

    if (phase === 'completed') {
      updateEmergency(
        emergency.id,
        {
          status: 'Completed',
          timeline: [
            ...(emergency.timeline || []),
            'Emergency response completed',
          ],
        },
        {
          title: 'Emergency completed',
          message: `${emergency.id} has been successfully handed over to hospital care.`,
          kind: 'success',
        }
      )
    }
  }, [phase])

  // --------------------------------------------------
  // NO EMERGENCY
  // --------------------------------------------------

  if (!emergency) {
    return (
      <div className="mx-auto max-w-xl py-20 text-center">
        <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-800 text-slate-400">
          <Activity size={28} />
        </div>

        <h2 className="text-xl font-semibold text-white">
          No emergency selected
        </h2>

        <p className="mt-2 text-sm text-slate-400">
          Report an emergency first to start live tracking.
        </p>

        <button
          onClick={() => navigate('/report')}
          className="mt-6 rounded-xl bg-cyan-500 px-5 py-3 text-sm font-semibold text-slate-950 hover:bg-cyan-400"
        >
          Report an Emergency
        </button>
      </div>
    )
  }

  // --------------------------------------------------
  // LOCATION
  // --------------------------------------------------

  const location =
    typeof emergency.location === 'string'
      ? emergency.location
      : emergency.location?.label || 'Location unavailable'

  // --------------------------------------------------
  // ETA
  // --------------------------------------------------

  const remaining = Math.max(
    0,
    JOURNEY_SECONDS * (1 - progress)
  )

  // --------------------------------------------------
  // TIMELINE
  // --------------------------------------------------

  const timeline = [
    ...(emergency.timeline || []),
  ]

  if (phase === 'arrived') {
    timeline.push('Ambulance arrived at hospital')
  }

  if (phase === 'handover') {
    timeline.push('Patient handover in progress')
  }

  if (phase === 'completed') {
    timeline.push('Emergency completed')
  }

  // --------------------------------------------------
  // FAMILY NOTIFICATION
  // --------------------------------------------------

  const handleNotifyFamily = () => {
    setFamilyNotified(true)

    notify(
      'Family notified',
      `Emergency ${emergency.id} response details have been shared with the emergency contact.`,
      'info'
    )
  }

  // --------------------------------------------------
  // ESCALATION DEMO
  // --------------------------------------------------

  const handleEscalation = () => {
    notify(
      'Response escalation triggered',
      'responsAI is searching for another available ambulance.',
      'critical'
    )
  }

  return (
    <div className="animate-fadeUp">
      {/* HEADER */}
      <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-widest text-cyan-400">
            Live response
          </p>

          <h1 className="mt-1 text-2xl font-bold text-white">
            Emergency Tracking
          </h1>

          <p className="mt-1 text-sm text-slate-400">
            <span className="font-mono text-cyan-300">
              {emergency.id}
            </span>

            {' · '}

            {emergency.type}

            {' · '}

            {location}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="rounded-full bg-red-500/10 px-3 py-1.5 text-xs font-semibold text-red-300">
            {emergency.severity || 'High'}
          </span>

          <span className="rounded-full bg-cyan-500/10 px-3 py-1.5 text-xs font-semibold text-cyan-300">
            {emergency.status || 'Processing'}
          </span>
        </div>
      </div>

      <div className="grid gap-5 xl:grid-cols-3">

        {/* LEFT SIDE */}
        <div className="space-y-5 xl:col-span-2">

          {/* MAP / ROUTE */}
          <div className="relative h-80 overflow-hidden rounded-3xl border border-slate-800 bg-slate-900">
            
            {/* Grid */}
            <div
              className="absolute inset-0 opacity-30"
              style={{
                backgroundImage:
                  'linear-gradient(#334155 1px, transparent 1px), linear-gradient(90deg, #334155 1px, transparent 1px)',
                backgroundSize: '40px 40px',
              }}
            />

            {/* Header */}
            <div className="relative z-10 flex items-center justify-between p-5">
              <div>
                <p className="text-xs uppercase tracking-wider text-slate-500">
                  Live route
                </p>

                <p className="mt-1 text-sm font-semibold text-white">
                  Emergency scene → Hospital
                </p>
              </div>

              <div className="flex items-center gap-2 rounded-full bg-emerald-500/10 px-3 py-1.5 text-xs font-semibold text-emerald-300">
                <span className="h-2 w-2 animate-pulse rounded-full bg-emerald-400" />
                LIVE
              </div>
            </div>

            {/* Route */}
            <div className="absolute left-[15%] right-[15%] top-1/2 h-1 rounded-full bg-slate-700">
              <div
                className="h-full rounded-full bg-cyan-400 transition-all duration-500"
                style={{
                  width: `${progress * 100}%`,
                }}
              />
            </div>

            {/* Starting point */}
            <div className="absolute left-[10%] top-[43%] flex flex-col items-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-red-500/20 text-red-400 ring-4 ring-red-500/10">
                <MapPin size={23} />
              </div>

              <span className="mt-2 text-[10px] font-semibold text-slate-400">
                INCIDENT
              </span>
            </div>

            {/* Ambulance */}
            <div
              className="absolute top-[42%] transition-all duration-500"
              style={{
                left: `${10 + progress * 70}%`,
              }}
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-cyan-500 text-slate-950 shadow-lg shadow-cyan-500/20">
                <Ambulance size={22} />
              </div>

              <span className="mt-2 block text-center text-[10px] font-bold text-cyan-300">
                AMBULANCE
              </span>
            </div>

            {/* Hospital */}
            <div className="absolute right-[10%] top-[43%] flex flex-col items-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-emerald-500/20 text-emerald-400 ring-4 ring-emerald-500/10">
                <Hospital size={23} />
              </div>

              <span className="mt-2 text-[10px] font-semibold text-slate-400">
                HOSPITAL
              </span>
            </div>

            {/* Bottom route info */}
            <div className="absolute bottom-5 left-5 right-5 flex items-center justify-between rounded-2xl border border-slate-700 bg-slate-950/80 px-4 py-3 backdrop-blur">
              <div>
                <p className="text-[10px] uppercase tracking-wider text-slate-500">
                  Current location
                </p>

                <p className="mt-1 text-xs text-slate-300">
                  {location}
                </p>
              </div>

              <div className="text-right">
                <p className="text-[10px] uppercase tracking-wider text-slate-500">
                  ETA
                </p>

                <p className="mt-1 font-mono text-lg font-bold text-cyan-300">
                  {phase === 'enroute'
                    ? formatTime(remaining)
                    : 'Arrived'}
                </p>
              </div>
            </div>
          </div>

          {/* INFORMATION CARDS */}
          <div className="grid gap-4 sm:grid-cols-3">

            {/* Ambulance */}
            <div className="rounded-2xl border border-slate-800 bg-slate-900 p-4">
              <div className="flex items-center gap-2 text-slate-500">
                <Ambulance size={15} />

                <p className="text-[10px] uppercase tracking-wider">
                  Ambulance
                </p>
              </div>

              <p className="mt-2 text-lg font-bold text-white">
                {emergency.ambulanceId || 'Searching...'}
              </p>

              <p className="mt-1 text-xs text-slate-400">
                {ambulance?.driver || 'Response driver'}
              </p>

              <span className="mt-2 inline-block rounded-full bg-cyan-500/10 px-2 py-1 text-[10px] font-semibold text-cyan-300">
                {ambulance?.status || 'DISPATCHED'}
              </span>
            </div>

            {/* Hospital */}
            <div className="rounded-2xl border border-slate-800 bg-slate-900 p-4">
              <div className="flex items-center gap-2 text-slate-500">
                <Hospital size={15} />

                <p className="text-[10px] uppercase tracking-wider">
                  Destination
                </p>
              </div>

              <p className="mt-2 text-lg font-bold text-white">
                {hospital?.name || 'Matching hospital...'}
              </p>

              <p className="mt-1 text-xs text-slate-400">
                {hospital?.address || 'Hospital location'}
              </p>
            </div>

            {/* ETA */}
            <div className="rounded-2xl border border-slate-800 bg-slate-900 p-4">
              <div className="flex items-center gap-2 text-slate-500">
                <Clock size={15} />

                <p className="text-[10px] uppercase tracking-wider">
                  Estimated arrival
                </p>
              </div>

              <p className="mt-2 text-lg font-bold text-cyan-300">
                {phase === 'enroute'
                  ? formatTime(remaining)
                  : 'Arrived'}
              </p>

              <p className="mt-1 text-xs text-slate-400">
                Live response simulation
              </p>
            </div>
          </div>

          {/* ESCALATION */}
          <div className="rounded-2xl border border-orange-500/20 bg-orange-500/5 p-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="flex items-center gap-2 text-sm font-semibold text-orange-300">
                  <ShieldAlert size={16} />
                  Response escalation
                </p>

                <p className="mt-1 text-xs text-slate-400">
                  Demonstrate what happens if an ambulance does not respond.
                </p>
              </div>

              <button
                onClick={handleEscalation}
                className="flex items-center gap-2 rounded-xl border border-orange-500/30 px-3 py-2 text-xs font-semibold text-orange-300 transition hover:bg-orange-500/10"
              >
                <RefreshCw size={14} />
                Simulate escalation
              </button>
            </div>
          </div>
        </div>

        {/* RIGHT SIDE */}
        <div className="space-y-5">

          {/* TIMELINE */}
          <div className="rounded-2xl border border-slate-800 bg-slate-900 p-5">
            <h3 className="text-sm font-semibold text-white">
              Response Timeline
            </h3>

            <div className="mt-5 space-y-4">
              {timeline.length === 0 ? (
                <p className="text-xs text-slate-500">
                  Waiting for response updates...
                </p>
              ) : (
                timeline.map((item, index) => {
                  const label =
                    typeof item === 'string'
                      ? item
                      : item.label || 'Response update'

                  return (
                    <div
                      key={index}
                      className="flex gap-3"
                    >
                      <div className="flex flex-col items-center">
                        <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-emerald-500/15 text-emerald-400">
                          <Check size={12} />
                        </div>

                        {index < timeline.length - 1 && (
                          <div className="mt-1 h-7 w-px bg-slate-700" />
                        )}
                      </div>

                      <div>
                        <p className="text-xs font-medium text-slate-200">
                          {label}
                        </p>

                        <p className="mt-1 text-[10px] text-slate-500">
                          Response network update
                        </p>
                      </div>
                    </div>
                  )
                })
              )}
            </div>
          </div>

          {/* FAMILY */}
          <div className="rounded-2xl border border-slate-800 bg-slate-900 p-5">
            <div className="flex items-center justify-between">
              <h3 className="flex items-center gap-2 text-sm font-semibold text-white">
                <Users
                  size={16}
                  className="text-emerald-400"
                />

                Family Notification
              </h3>

              {familyNotified ? (
                <span className="rounded-full bg-emerald-500/10 px-2 py-1 text-[10px] font-semibold text-emerald-400">
                  ✓ Notified
                </span>
              ) : (
                <span className="rounded-full bg-orange-500/10 px-2 py-1 text-[10px] font-semibold text-orange-300">
                  Pending
                </span>
              )}
            </div>

            <div className="mt-4 rounded-xl bg-slate-950/50 p-4">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-800">
                  <Phone
                    size={17}
                    className="text-slate-400"
                  />
                </div>

                <div>
                  <p className="text-xs font-semibold text-white">
                    Emergency Contact
                  </p>

                  <p className="mt-1 text-[10px] text-slate-500">
                    Contact information from emergency report
                  </p>
                </div>
              </div>

              {emergency.contact && (
                <p className="mt-3 text-xs text-slate-300">
                  {emergency.contact}
                </p>
              )}
            </div>

            {!familyNotified ? (
              <button
                onClick={handleNotifyFamily}
                className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-cyan-500 px-4 py-3 text-xs font-bold text-slate-950 transition hover:bg-cyan-400"
              >
                <Navigation size={14} />
                Notify Family
              </button>
            ) : (
              <div className="mt-4 rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-3 text-[11px] leading-relaxed text-emerald-200">
                Family notification has been sent successfully.
                The emergency response is currently being tracked.
              </div>
            )}
          </div>

          {/* STATUS */}
          <div className="rounded-2xl border border-cyan-500/20 bg-cyan-500/5 p-5">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-500/10 text-cyan-300">
                <Activity size={19} />
              </div>

              <div>
                <p className="text-sm font-semibold text-white">
                  responsAI Orchestrator
                </p>

                <p className="mt-1 text-xs text-slate-400">
                  Monitoring emergency response
                </p>
              </div>
            </div>

            <div className="mt-4 h-2 overflow-hidden rounded-full bg-slate-800">
              <div
                className="h-full rounded-full bg-cyan-400 transition-all duration-500"
                style={{
                  width: `${progress * 100}%`,
                }}
              />
            </div>

            <p className="mt-2 text-[10px] text-slate-500">
              {phase === 'enroute' &&
                'Ambulance is travelling to the hospital.'}

              {phase === 'arrived' &&
                'Ambulance has arrived at the hospital.'}

              {phase === 'handover' &&
                'Patient handover is in progress.'}

              {phase === 'completed' &&
                'Emergency response completed.'}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}