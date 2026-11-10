
import { Check, MapPin, Navigation, Phone, Truck } from 'lucide-react'
import { useApp } from '../context/AppContext'
import { PageTitle, StatusBadge } from '../components/common/UI'

export default function Driver() {
  const {
    emergencies,
    ambulances,
    advanceEmergency,
    dispatch,
  } = useApp()

  const emergency =
    emergencies.find(
      (e) => e.status !== 'Resolved' && e.ambulanceId
    ) || emergencies[0]

  const ambulance =
    ambulances.find((a) => a.id === emergency?.ambulanceId) ||
    ambulances[0]

  if (!emergency) return null

  const actions = [
    {
      label: 'Accept dispatch',
      fn: () => dispatch(emergency.id),
      disabled:
        emergency.status !== 'Hospital notified' &&
        emergency.status !== 'AI analysis complete',
    },
    {
      label: 'Arrived at scene',
      fn: () => advanceEmergency(emergency.id, 'arrived'),
    },
    {
      label: 'Start transport',
      fn: () => advanceEmergency(emergency.id, 'transport'),
    },
    {
      label: 'Arrived at hospital',
      fn: () => advanceEmergency(emergency.id, 'hospital'),
    },
    {
      label: 'Complete handover',
      fn: () => advanceEmergency(emergency.id, 'handover'),
    },
  ]

  return (
    <>
      <PageTitle
        eyebrow="Driver operations"
        title="Your dispatch panel"
        description="Follow the response sequence and keep the coordinator updated at every handoff."
        action={<StatusBadge value={ambulance?.status || 'Unknown'} />}
      />

      <div className="grid gap-6 xl:grid-cols-[1fr_380px]">

        {/* LEFT: EMERGENCY AND MAP */}
        <div className="overflow-hidden rounded-2xl border border-slate-800 bg-slate-900/70">

          {/* EMERGENCY HEADER */}
          <div className="flex items-center justify-between border-b border-slate-800 p-6">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-slate-500">
                Assigned emergency
              </p>

              <h2 className="mt-1 text-2xl font-bold text-white">
                {emergency.id}
              </h2>

              <p className="mt-1 text-xs text-slate-400">
                Ambulance: {ambulance?.id || 'Not assigned'}
              </p>
            </div>

            <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-cyan-500/10">
              <Truck className="text-cyan-400" size={21} />
            </span>
          </div>

          {/* DEMO MAP */}
          <div
            className="relative h-72 overflow-hidden border-b border-slate-800 bg-[#101e30]"
            style={{
              backgroundImage:
                'linear-gradient(35deg, transparent 47%, rgba(34,211,238,.08) 48%, rgba(34,211,238,.08) 51%, transparent 52%), linear-gradient(125deg, transparent 47%, rgba(34,211,238,.07) 48%, rgba(34,211,238,.07) 51%, transparent 52%)',
              backgroundSize: '75px 75px',
            }}
          >
            {/* MAP GRID */}
            <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 via-transparent to-blue-500/10" />

            {/* PICKUP MARKER */}
            <div className="absolute left-[18%] top-[35%] flex h-11 w-11 items-center justify-center rounded-full border-4 border-red-400/20 bg-red-500 text-white shadow-xl shadow-red-500/20">
              <MapPin size={19} />
            </div>

            {/* AMBULANCE MARKER */}
            <div className="absolute bottom-[23%] right-[23%] flex h-11 w-11 items-center justify-center rounded-full border-4 border-cyan-400/20 bg-cyan-500 text-slate-950 shadow-xl shadow-cyan-500/20">
              <Truck size={19} />
            </div>

            {/* ROUTE LINE */}
            <div className="absolute left-[23%] top-[45%] h-20 w-[52%] rotate-[18deg] border-t-2 border-dashed border-cyan-400" />

            {/* MAP LABEL */}
            <span className="absolute left-4 top-4 rounded-lg border border-slate-700 bg-slate-900/90 px-3 py-1.5 text-[10px] font-bold tracking-wider text-cyan-300">
              LIVE DEMO MAP
            </span>

            {/* LEGEND */}
            <div className="absolute bottom-4 left-4 flex flex-wrap gap-3 rounded-xl border border-slate-700 bg-slate-900/90 px-3 py-2">
              <span className="flex items-center gap-1.5 text-[10px] text-slate-300">
                <span className="h-2 w-2 rounded-full bg-red-500" />
                Pickup
              </span>

              <span className="flex items-center gap-1.5 text-[10px] text-slate-300">
                <span className="h-2 w-2 rounded-full bg-cyan-400" />
                Ambulance
              </span>
            </div>
          </div>

          {/* LOCATION DETAILS */}
          <div className="grid gap-4 p-6 sm:grid-cols-2">

            <div className="flex gap-3 rounded-xl border border-slate-800 bg-slate-800/50 p-4">
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-red-500/10">
                <MapPin className="text-red-400" size={18} />
              </span>

              <div className="min-w-0">
                <p className="text-xs text-slate-500">
                  Pickup location
                </p>

                <p className="mt-1 break-words text-sm font-semibold text-white">
                  {emergency.location || 'Location unavailable'}
                </p>
              </div>
            </div>

            <div className="flex gap-3 rounded-xl border border-slate-800 bg-slate-800/50 p-4">
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-emerald-500/10">
                <Navigation className="text-emerald-400" size={18} />
              </span>

              <div className="min-w-0">
                <p className="text-xs text-slate-500">
                  Destination hospital
                </p>

                <p className="mt-1 text-sm font-semibold text-white">
                  Mercy General
                </p>

                <p className="text-[10px] text-slate-500">
                  Estimated travel: 8 min
                </p>
              </div>
            </div>

          </div>
        </div>

        {/* RIGHT PANEL */}
        <div className="space-y-6">

          {/* DISPATCH SEQUENCE */}
          <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-6">
            <div className="flex items-center gap-2">
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-cyan-500/10">
                <Check size={16} className="text-cyan-400" />
              </span>

              <h3 className="text-sm font-bold text-white">
                Dispatch sequence
              </h3>
            </div>

            <div className="mt-5 space-y-2">
              {actions.map((action, index) => (
                <button
                  key={action.label}
                  type="button"
                  disabled={action.disabled}
                  onClick={action.fn}
                  className="group flex w-full items-center gap-3 rounded-xl border border-slate-700 bg-slate-800/60 p-3 text-left text-sm font-semibold text-slate-300 transition hover:border-cyan-500/40 hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  <span
                    className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-bold ${
                      index === 0
                        ? 'bg-cyan-500 text-slate-950'
                        : 'bg-slate-700 text-slate-300'
                    }`}
                  >
                    {index + 1}
                  </span>

                  <span className="flex-1">
                    {action.label}
                  </span>

                  <Check
                    size={16}
                    className="text-slate-600 transition group-hover:text-cyan-400"
                  />
                </button>
              ))}
            </div>

            <p className="mt-4 text-[10px] leading-relaxed text-slate-500">
              Update each stage as the emergency response progresses.
            </p>
          </div>

          {/* EMERGENCY INFORMATION */}
          <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-6">
            <div className="flex items-center gap-2">
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-red-500/10">
                <Phone size={15} className="text-red-400" />
              </span>

              <h3 className="text-sm font-bold text-white">
                Emergency information
              </h3>
            </div>

            <p className="mt-3 text-sm leading-6 text-slate-400">
              {emergency.summary || emergency.description}
            </p>

            <a
              href="tel:5550192"
              className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl border border-slate-700 bg-slate-800 px-4 py-3 text-sm font-semibold text-slate-300 transition hover:border-cyan-500/50 hover:text-cyan-400"
            >
              <Phone size={16} />
              Contact coordinator
            </a>
          </div>

        </div>
      </div>
    </>
  )
}
