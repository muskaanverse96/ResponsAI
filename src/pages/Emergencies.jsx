
import { Filter, MapPin, Search, Siren } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useState } from 'react'
import { useApp } from '../context/AppContext'
import { PageTitle, StatusBadge } from '../components/common/UI'

export default function Emergencies() {
  const { emergencies } = useApp()
  const [query, setQuery] = useState('')

  const filtered = emergencies.filter((e) =>
    `${e.id} ${e.type} ${e.location}`
      .toLowerCase()
      .includes(query.toLowerCase())
  )

  return (
    <>
      <PageTitle
        eyebrow="Command center / Incidents"
        title="Emergency queue"
        description="Monitor every active and resolved incident across the city."
        action={
          <Link to="/report" className="btn-primary">
            <Siren size={17} />
            New report
          </Link>
        }
      />

      <div className="overflow-hidden rounded-2xl border border-slate-800 bg-slate-900/70">

        {/* SEARCH AND FILTER */}
        <div className="flex flex-col gap-3 border-b border-slate-800 p-4 md:flex-row">

          <div className="relative flex-1">
            <Search
              className="absolute left-3 top-3 text-slate-500"
              size={17}
            />

            <input
              className="mt-0 w-full rounded-xl border border-slate-700 bg-slate-800 px-3.5 py-3 pl-10 text-sm text-white outline-none placeholder:text-slate-500 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20"
              placeholder="Search incidents, locations, or IDs"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </div>

          <button className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-700 bg-slate-800 px-4 py-2.5 text-sm font-semibold text-slate-300 transition hover:border-cyan-500 hover:text-cyan-400">
            <Filter size={16} />
            Filter view
          </button>

        </div>

        {/* EMERGENCY LIST */}
        <div className="divide-y divide-slate-800">

          {filtered.map((emergency) => (

            <Link
              to={`/analysis/${emergency.id}`}
              key={emergency.id}
              className="flex flex-col gap-4 p-5 transition hover:bg-slate-800/60 md:flex-row md:items-center"
            >

              <div
                className={`rounded-xl p-3 ${
                  emergency.severity === 'CRITICAL'
                    ? 'bg-red-500/10 text-red-400'
                    : 'bg-amber-500/10 text-amber-400'
                }`}
              >
                <Siren size={19} />
              </div>

              <div className="min-w-0 flex-1">

                <div className="flex flex-wrap items-center gap-2">

                  <p className="font-bold text-white">
                    {emergency.id}
                  </p>

                  <StatusBadge value={emergency.severity} />

                  <span className="text-xs text-slate-400">
                    {emergency.type}
                  </span>

                </div>

                <p className="mt-2 flex items-center gap-1 text-sm text-slate-400">
                  <MapPin size={14} />
                  {emergency.location}
                </p>

              </div>

              <div className="flex items-center gap-5">

                <div className="text-left md:text-right">

                  <p className="text-xs text-slate-500">
                    Current status
                  </p>

                  <div className="mt-1">
                    <StatusBadge value={emergency.status} />
                  </div>

                </div>

                <span className="text-xs text-slate-500">
                  {emergency.time || 'Just now'}
                </span>

              </div>

            </Link>

          ))}

          {filtered.length === 0 && (
            <div className="p-12 text-center">
              <Siren
                size={30}
                className="mx-auto mb-3 text-slate-600"
              />

              <p className="font-semibold text-white">
                No emergencies found
              </p>

              <p className="mt-1 text-sm text-slate-400">
                Try another search term.
              </p>
            </div>
          )}

        </div>
      </div>
    </>
  )
}
