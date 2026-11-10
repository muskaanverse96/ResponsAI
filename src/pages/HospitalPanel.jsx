
import {
  BedDouble,
  Check,
  Clock3,
  Droplets,
  Hospital,
  X,
} from 'lucide-react'

import { useApp } from '../context/AppContext'
import { PageTitle, StatusBadge } from '../components/common/UI'

export default function HospitalPanel() {
  const {
    emergencies,
    hospitals,
    acceptHospital,
    updateEmergency,
  } = useApp()

  const hospital = hospitals[0]

  if (!hospital) {
    return (
      <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-8 text-center">
        <Hospital className="mx-auto text-slate-500" size={30} />
        <p className="mt-3 text-sm text-slate-400">
          Hospital information is currently unavailable.
        </p>
      </div>
    )
  }

  const incoming = emergencies.filter(
    (e) =>
      e.hospitalId === hospital.id &&
      e.status !== 'Resolved'
  )

  return (
    <>
      <PageTitle
        eyebrow="Hospital operations"
        title="Mercy General panel"
        description="Review incoming cases, confirm readiness, and keep care teams informed."
      />

      {/* HOSPITAL STATISTICS */}
      <div className="grid gap-4 sm:grid-cols-3">

        {/* BEDS */}
        <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-5">
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-500/10">
            <BedDouble className="text-cyan-400" size={20} />
          </span>

          <p className="mt-4 font-display text-3xl font-bold text-white">
            {hospital.beds}
          </p>

          <p className="mt-1 text-sm text-slate-400">
            Beds available
          </p>
        </div>

        {/* EMERGENCY DEPARTMENT */}
        <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-5">
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/10">
            <Hospital className="text-emerald-400" size={20} />
          </span>

          <p className="mt-4 font-display text-3xl font-bold text-white">
            {hospital.ed}
          </p>

          <p className="mt-1 text-sm text-slate-400">
            Emergency department
          </p>
        </div>

        {/* BLOOD STOCK */}
        <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-5">
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-500/10">
            <Droplets className="text-amber-400" size={20} />
          </span>

          <p className="mt-4 font-display text-3xl font-bold text-white">
            18
          </p>

          <p className="mt-1 text-sm text-slate-400">
            O- units in stock
          </p>
        </div>
      </div>

      {/* MAIN CONTENT */}
      <div className="mt-6 grid gap-6 xl:grid-cols-[1fr_340px]">

        {/* INCOMING EMERGENCIES */}
        <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-6">

          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 className="text-base font-bold text-white">
                Incoming emergencies
              </h2>

              <p className="mt-1 text-xs text-slate-500">
                Review and respond to incoming cases.
              </p>
            </div>

            <span className="rounded-full border border-red-500/20 bg-red-500/10 px-3 py-1 text-xs font-bold text-red-400">
              {incoming.length} active
            </span>
          </div>

          <div className="mt-5 space-y-3">
            {incoming.length ? (
              incoming.map((emergency) => (
                <div
                  key={emergency.id}
                  className="rounded-xl border border-slate-700 bg-slate-800/50 p-4 transition hover:border-slate-600"
                >
                  {/* EMERGENCY DETAILS */}
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <p className="font-bold text-white">
                        {emergency.id}

                        <span className="ml-2 text-xs font-normal text-slate-400">
                          {emergency.type}
                        </span>
                      </p>

                      <p className="mt-1 flex items-center gap-1.5 text-sm text-slate-400">
                        <span className="text-cyan-400">
                          <Hospital size={13} />
                        </span>
                        {emergency.location}
                      </p>
                    </div>

                    <StatusBadge value={emergency.severity} />
                  </div>

                  {/* ACTION BUTTONS */}
                  <div className="mt-4 flex flex-wrap gap-2">
                    <button
                      type="button"
                      onClick={() => acceptHospital(emergency.id)}
                      className="flex items-center justify-center gap-2 rounded-xl bg-cyan-500 px-4 py-2.5 text-xs font-bold text-slate-950 transition hover:bg-cyan-400"
                    >
                      <Check size={15} />
                      Accept emergency
                    </button>

                    <button
                      type="button"
                      onClick={() =>
                        updateEmergency(
                          emergency.id,
                          { status: 'Hospital rejected' },
                          {
                            title: 'Hospital rejected',
                            message: `${hospital.name} rejected ${emergency.id} for reassignment.`,
                            kind: 'critical',
                          }
                        )
                      }
                      className="flex items-center justify-center gap-2 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-2.5 text-xs font-semibold text-red-400 transition hover:bg-red-500/20"
                    >
                      <X size={15} />
                      Reject
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div className="rounded-xl border border-dashed border-slate-700 py-12 text-center">
                <Check className="mx-auto text-emerald-400" size={28} />

                <p className="mt-3 text-sm font-medium text-slate-300">
                  No incoming emergencies
                </p>

                <p className="mt-1 text-xs text-slate-500">
                  No cases currently require a hospital decision.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* READINESS SNAPSHOT */}
        <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-6">

          <div className="flex items-center gap-2">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-cyan-500/10">
              <Hospital size={16} className="text-cyan-400" />
            </span>

            <h2 className="text-sm font-bold text-white">
              Readiness snapshot
            </h2>
          </div>

          <div className="mt-5 space-y-5">

            {/* BED CAPACITY */}
            <div>
              <div className="flex justify-between gap-3 text-sm">
                <span className="text-slate-400">
                  Bed capacity
                </span>

                <strong className="text-white">
                  {hospital.capacity}%
                </strong>
              </div>

              <div className="mt-2 h-2 overflow-hidden rounded-full bg-slate-800">
                <div
                  className="h-full rounded-full bg-cyan-400 transition-all"
                  style={{
                    width: `${Math.min(
                      100,
                      Math.max(0, Number(hospital.capacity) || 0)
                    )}%`,
                  }}
                />
              </div>
            </div>

            {/* TRAUMA TEAM */}
            <div className="flex items-center justify-between gap-3">
              <span className="text-sm text-slate-400">
                Trauma team
              </span>

              <strong className="flex items-center gap-1.5 text-xs text-emerald-400">
                <Check size={14} />
                Available
              </strong>
            </div>

            {/* BLOOD BANK */}
            <div className="flex items-center justify-between gap-3">
              <span className="text-sm text-slate-400">
                Blood bank sync
              </span>

              <strong className="flex items-center gap-1.5 text-xs text-emerald-400">
                <Check size={14} />
                Live
              </strong>
            </div>

            {/* NEXT REVIEW */}
            <div className="flex items-center gap-3 rounded-xl border border-slate-700 bg-slate-800/70 p-3">
              <Clock3 size={17} className="shrink-0 text-cyan-400" />

              <div>
                <p className="text-xs font-medium text-slate-300">
                  Next capacity review
                </p>

                <p className="mt-0.5 text-[10px] text-slate-500">
                  In 18 minutes
                </p>
              </div>
            </div>

          </div>
        </div>
      </div>
    </>
  )
}
