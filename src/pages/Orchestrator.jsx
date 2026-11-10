
import {
  BellRing,
  Check,
  ChevronRight,
  Hospital,
  Siren,
  Truck,
  UserRound,
  Zap
} from 'lucide-react'

import { useApp } from '../context/AppContext'
import { PageTitle, StatusBadge } from '../components/common/UI'
import { useState } from 'react'

const steps = [
  { key: 'reported', label: 'Emergency', icon: Siren },
  { key: 'analysis', label: 'AI classification', icon: Zap },
  { key: 'dispatch', label: 'Ambulance', icon: Truck },
  { key: 'hospital', label: 'Hospital', icon: Hospital },
  { key: 'family', label: 'Family notified', icon: UserRound },
  { key: 'tracking', label: 'Live tracking', icon: BellRing }
]

export default function Orchestrator() {
  const {
    emergencies,
    dispatch,
    acceptHospital,
    updateEmergency
  } = useApp()

  const [selectedId, setSelectedId] = useState(
    emergencies.find((e) => e.status !== 'Resolved')?.id ||
    emergencies[0]?.id
  )

  const emergency =
    emergencies.find((e) => e.id === selectedId) || emergencies[0]

  if (!emergency) return null

  const activeIndex =
    emergency.status === 'Resolved'
      ? 6
      : emergency.status.includes('en route')
        ? 3
        : emergency.status.includes('Hospital')
          ? 4
          : 2

  const escalate = () =>
    updateEmergency(
      emergency.id,
      {
        status: 'Response delayed',
        escalation: true,
        timeline: [
          ...(emergency.timeline || []),
          'Escalated'
        ]
      },
      {
        title: 'Emergency escalated',
        message: `${emergency.id} needs coordinator attention.`,
        kind: 'critical'
      }
    )

  return (
    <>
      <PageTitle
        eyebrow="Command center / Workflow"
        title="Response orchestrator"
        description="Move one incident through a coordinated response with a clear audit trail."
      />

      <div className="grid gap-6 xl:grid-cols-[280px_1fr]">

        {/* Active Incidents */}
        <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-4">
          <p className="eyebrow px-2 text-slate-400">
            Active incidents
          </p>

          <div className="mt-3 space-y-2">
            {emergencies
              .filter((e) => e.status !== 'Resolved')
              .map((item) => (
                <button
                  key={item.id}
                  onClick={() => setSelectedId(item.id)}
                  className={`w-full rounded-xl border border-transparent p-3 text-left transition ${
                    selectedId === item.id
                      ? 'border-cyan-400/30 bg-cyan-500/15 text-cyan-300'
                      : 'text-slate-300 hover:bg-slate-800'
                  }`}
                >
                  <div className="flex justify-between">
                    <span className="text-sm font-bold">
                      {item.id}
                    </span>

                    <span
                      className={`h-2 w-2 rounded-full ${
                        item.severity === 'CRITICAL'
                          ? 'bg-red-400'
                          : 'bg-amber-400'
                      }`}
                    />
                  </div>

                  <p className="mt-1 truncate text-xs text-slate-400">
                    {item.location}
                  </p>
                </button>
              ))}
          </div>
        </div>

        <div className="space-y-6">

          {/* Emergency Details and Workflow */}
          <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-6">

            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <p className="eyebrow text-slate-400">
                  Coordinating
                </p>

                <h2 className="mt-1 text-2xl font-bold text-white">
                  {emergency.id}
                </h2>

                <p className="mt-1 text-sm text-slate-400">
                  {emergency.description}
                </p>
              </div>

              <StatusBadge value={emergency.status} />
            </div>

            {/* Workflow Steps */}
            <div className="mt-9 flex flex-col gap-3 md:flex-row md:items-start md:justify-between">

              {steps.map((step, index) => {
                const Icon = step.icon
                const complete = index < activeIndex

                return (
                  <div
                    key={step.key}
                    className="flex items-center gap-3 md:block md:flex-1 md:text-center"
                  >
                    <div
                      className="relative mx-auto inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-full border-2"
                      style={{
                        borderColor:
                          complete || index === activeIndex
                            ? '#22d3ee'
                            : '#334155',

                        background: complete
                          ? '#0891b2'
                          : index === activeIndex
                            ? '#164e63'
                            : '#0f172a',

                        color: complete || index === activeIndex
                          ? '#67e8f9'
                          : '#94a3b8'
                      }}
                    >
                      <Icon size={17} />

                      {index < steps.length - 1 && (
                        <span className="absolute left-12 hidden h-px w-[calc(100%+1rem)] bg-slate-700 md:block" />
                      )}
                    </div>

                    <p className="text-xs font-bold text-slate-300 md:mt-2">
                      {step.label}
                    </p>

                    {index < steps.length - 1 && (
                      <ChevronRight
                        className="ml-auto text-slate-600 md:hidden"
                        size={16}
                      />
                    )}
                  </div>
                )
              })}

            </div>
          </div>

          <div className="grid gap-6 lg:grid-cols-2">

            {/* Coordinator Actions */}
            <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-6">

              <h3 className="font-bold text-white">
                Coordinator actions
              </h3>

              <div className="mt-5 grid gap-3 sm:grid-cols-2">

                <button
                  onClick={() => dispatch(emergency.id)}
                  disabled={emergency.status.includes('en route')}
                  className="flex items-center justify-center gap-2 rounded-xl bg-cyan-500 px-4 py-3 text-sm font-bold text-slate-950 transition hover:bg-cyan-400 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  <Truck size={16} />
                  Dispatch ambulance
                </button>

                <button
                  onClick={() => acceptHospital(emergency.id)}
                  disabled={emergency.status === 'Hospital accepted'}
                  className="flex items-center justify-center gap-2 rounded-xl border border-slate-700 bg-slate-800 px-4 py-3 text-sm font-semibold text-slate-200 transition hover:border-cyan-400 hover:bg-slate-700 disabled:opacity-40"
                >
                  <Hospital size={16} />
                  Notify hospital
                </button>

                <button
                  onClick={() =>
                    updateEmergency(
                      emergency.id,
                      {
                        notifiedFamily: true,
                        timeline: [
                          ...(emergency.timeline || []),
                          'Family notified'
                        ]
                      },
                      {
                        title: 'Family notified',
                        message: `${emergency.contact} has been queued for an update.`
                      }
                    )
                  }
                  className="flex items-center justify-center gap-2 rounded-xl border border-slate-700 bg-slate-800 px-4 py-3 text-sm font-semibold text-slate-200 transition hover:border-cyan-400 hover:bg-slate-700"
                >
                  <UserRound size={16} />
                  Notify family
                </button>

                <button
                  onClick={escalate}
                  className="flex items-center justify-center gap-2 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm font-semibold text-red-400 transition hover:bg-red-500/20"
                >
                  <Zap size={16} />
                  Escalate response
                </button>

              </div>

              {emergency.escalation && (
                <div className="mt-5 rounded-xl border border-red-500/20 bg-red-500/10 p-4 text-sm text-red-300">
                  <p className="font-bold">
                    Response timeout detected
                  </p>

                  <p className="mt-1">
                    Try the next available ambulance or hospital resource.
                  </p>
                </div>
              )}

            </div>

            {/* Audit Timeline */}
            <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-6">

              <h3 className="font-bold text-white">
                Audit timeline
              </h3>

              <div className="mt-5 space-y-4">

                {(emergency.timeline || []).map((event, index) => (
                  <div
                    key={`${event}-${index}`}
                    className="flex gap-3 text-sm"
                  >
                    <span className="mt-1 flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-emerald-500/15 text-emerald-400">
                      <Check size={11} />
                    </span>

                    <div>
                      <p className="font-semibold text-slate-200">
                        {event}
                      </p>

                      <p className="text-xs text-slate-500">
                        Recorded by response network
                      </p>
                    </div>
                  </div>
                ))}

              </div>
            </div>

          </div>
        </div>
      </div>
    </>
  )
}
