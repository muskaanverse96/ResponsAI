
import { MapPin, Radio, Truck } from 'lucide-react'
import { useApp } from '../context/AppContext'
import { PageTitle, StatusBadge, StatCard } from '../components/common/UI'

export default function Ambulances() {
  const { ambulances } = useApp()

  return (
    <>
      <PageTitle
        eyebrow="Fleet operations"
        title="Ambulance fleet"
        description="Monitor vehicle readiness, equipment, and current positions."
      />

      {/* Fleet statistics */}
      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard
          label="Total fleet"
          value={ambulances.length}
          detail="Registered units"
          icon={Truck}
        />

        <StatCard
          label="Available now"
          value={ambulances.filter((a) => a.status === 'AVAILABLE').length}
          detail="Ready for dispatch"
          icon={Radio}
          tone="green"
        />

        <StatCard
          label="In response"
          value={ambulances.filter(
            (a) => a.status !== 'AVAILABLE' && a.status !== 'UNAVAILABLE'
          ).length}
          detail="Active assignments"
          icon={MapPin}
          tone="red"
        />
      </div>

      {/* Ambulance cards */}
      <div className="mt-6 grid gap-4 md:grid-cols-2">
        {ambulances.map((ambulance) => (
          <div
            className="rounded-2xl border border-slate-800 bg-slate-900/70 p-5 shadow-sm transition hover:border-slate-700"
            key={ambulance.id}
          >
            {/* Vehicle information */}
            <div className="flex items-start justify-between gap-3">
              <div className="flex min-w-0 gap-3">
                <div className="rounded-xl bg-cyan-500/10 p-3 text-cyan-400">
                  <Truck size={20} />
                </div>

                <div className="min-w-0">
                  <h3 className="font-bold text-white">
                    {ambulance.id}
                  </h3>

                  <p className="mt-1 text-sm text-slate-400">
                    {ambulance.driver}
                  </p>
                </div>
              </div>

              <StatusBadge value={ambulance.status} />
            </div>

            {/* Location and ETA */}
            <div className="mt-5 grid grid-cols-2 gap-3 text-sm">
              <div className="rounded-xl border border-slate-800 bg-slate-800/70 p-3">
                <p className="text-xs text-slate-400">
                  Current location
                </p>

                <p className="mt-1 font-semibold text-slate-200">
                  {ambulance.location}
                </p>
              </div>

              <div className="rounded-xl border border-slate-800 bg-slate-800/70 p-3">
                <p className="text-xs text-slate-400">
                  ETA / distance
                </p>

                <p className="mt-1 font-semibold text-slate-200">
                  {ambulance.eta
                    ? `${ambulance.eta} min · ${ambulance.distance}`
                    : 'Offline'}
                </p>
              </div>
            </div>

            {/* Equipment */}
            <div className="mt-5">
              <p className="mb-3 text-xs font-bold uppercase tracking-widest text-slate-500">
                Available equipment
              </p>

              <div className="flex flex-wrap gap-2">
                {ambulance.equipment.map((item) => (
                  <span
                    key={item}
                    className="rounded-full border border-slate-700 bg-slate-800/70 px-3 py-1 text-xs font-medium text-slate-300"
                  >
                    {item}
                  </span>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>

      {ambulances.length === 0 && (
        <div className="mt-6 rounded-2xl border border-slate-800 bg-slate-900/70 p-10 text-center">
          <Truck size={30} className="mx-auto text-slate-500" />
          <h3 className="mt-3 font-semibold text-white">
            No ambulances registered
          </h3>
          <p className="mt-1 text-sm text-slate-400">
            Ambulance fleet information will appear here when available.
          </p>
        </div>
      )}
    </>
  )
}
