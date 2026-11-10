
import { BedDouble, CheckCircle2, Hospital, MapPin } from 'lucide-react'
import { useApp } from '../context/AppContext'
import { PageTitle, StatusBadge } from '../components/common/UI'

export default function Hospitals() {
  const { hospitals } = useApp()

  return (
    <>
      <PageTitle
        eyebrow="Care network"
        title="Hospital readiness"
        description="Compare emergency department status, capacity, capability, and resource availability."
      />

      <div className="grid gap-5 lg:grid-cols-3">
        {hospitals.map((hospital) => (
          <div
            className="rounded-2xl border border-slate-800 bg-slate-900/70 p-6 shadow-sm transition hover:border-slate-700"
            key={hospital.id}
          >
            {/* Hospital header */}
            <div className="flex items-start justify-between gap-3">
              <div className="rounded-xl bg-cyan-500/10 p-3 text-cyan-400">
                <Hospital size={21} />
              </div>

              <StatusBadge value={hospital.ed} />
            </div>

            <h2 className="mt-5 text-xl font-bold text-white">
              {hospital.name}
            </h2>

            <p className="mt-1 flex items-center gap-1 text-sm text-slate-400">
              <MapPin size={14} className="shrink-0" />
              {hospital.location}
            </p>

            {/* Hospital statistics */}
            <div className="mt-6 grid grid-cols-2 gap-3">
              <div className="rounded-xl border border-slate-800 bg-slate-800/70 p-3">
                <BedDouble size={17} className="text-cyan-400" />

                <p className="mt-2 text-xl font-bold text-white">
                  {hospital.beds}
                </p>

                <p className="text-xs text-slate-400">
                  Beds available
                </p>
              </div>

              <div className="rounded-xl border border-slate-800 bg-slate-800/70 p-3">
                <p className="text-xs text-slate-400">
                  Capacity
                </p>

                <p className="mt-2 text-xl font-bold text-white">
                  {hospital.capacity}%
                </p>

                <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-slate-700">
                  <div
                    className="h-1.5 rounded-full bg-cyan-400 transition-all"
                    style={{ width: `${hospital.capacity}%` }}
                  />
                </div>
              </div>
            </div>

            {/* Capabilities */}
            <p className="mt-6 text-xs font-bold uppercase tracking-widest text-slate-500">
              Capabilities
            </p>

            <div className="mt-3 space-y-3">
              {hospital.capabilities.map((item) => (
                <p
                  key={item}
                  className="flex items-center gap-2 text-sm text-slate-300"
                >
                  <CheckCircle2
                    size={15}
                    className="shrink-0 text-emerald-400"
                  />
                  {item}
                </p>
              ))}
            </div>
          </div>
        ))}
      </div>

      {hospitals.length === 0 && (
        <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-10 text-center">
          <Hospital size={30} className="mx-auto text-slate-500" />
          <h3 className="mt-3 font-semibold text-white">
            No hospitals available
          </h3>
          <p className="mt-1 text-sm text-slate-400">
            Hospital information will appear here when available.
          </p>
        </div>
      )}
    </>
  )
}
