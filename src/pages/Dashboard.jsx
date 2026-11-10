
import {
  AlertTriangle,
  ArrowRight,
  Bell,
  MapPin,
  Plus,
  Siren,
  Truck,
  Users,
  Bot
} from 'lucide-react'

import { Link } from 'react-router-dom'
import { useApp } from '../context/AppContext'
import {
  PageTitle,
  SectionHeader,
  StatCard,
  StatusBadge
} from '../components/common/UI'

import { useState } from 'react'
import CallBotPopup from '../components/common/CallBotPopup'

export default function Dashboard() {
  const {
    emergencies,
    ambulances,
    hospitals,
    notifications,
    user
  } = useApp()

  const [callBotOpen, setCallBotOpen] = useState(false)

  const active = emergencies.filter(
    (e) => e.status !== 'Resolved'
  )

  const critical = active.filter(
    (e) => e.severity === 'CRITICAL'
  ).length

  const isCitizen = user?.role === 'Citizen'

  return (
    <>
      <PageTitle
        eyebrow="Command center / Overview"
        title={
          isCitizen
            ? 'Welcome to responsAI'
            : 'Good morning, coordinator'
        }
        description={
          isCitizen
            ? 'Report an emergency, track your response, or get immediate assistance from the AI CallBot.'
            : 'A live view of the response network and the incidents that need attention now.'
        }
        action={
          <Link to="/report" className="btn-primary">
            <Plus size={17} />
            Report emergency
          </Link>
        }
      />

      {/* CITIZEN CALLBOT BANNER */}
      {isCitizen && (
        <div className="mb-6 overflow-hidden rounded-3xl border border-slate-800 bg-slate-900 p-5 text-white shadow-lg">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">

            <div className="flex items-start gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-red-500">
                <Bot size={24} />
              </div>

              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-red-300">
                  AI Emergency Assistant
                </p>

                <h2 className="mt-1 text-xl font-bold text-white">
                  Need emergency help?
                </h2>

                <p className="mt-1 max-w-xl text-sm leading-6 text-slate-400">
                  Talk to responsAI CallBot and describe what happened.
                  The system will analyze the emergency and coordinate the response.
                </p>
              </div>
            </div>

            <button
              onClick={() => setCallBotOpen(true)}
              className="flex shrink-0 items-center justify-center gap-2 rounded-xl bg-red-500 px-5 py-3 font-bold text-white transition hover:bg-red-600"
            >
              <Bot size={18} />
              Talk to AI CallBot
            </button>

          </div>
        </div>
      )}

      {/* STATISTICS */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">

        <StatCard
          label="Active emergencies"
          value={active.length}
          detail="Across the response network"
          icon={Siren}
          tone="red"
        />

        <StatCard
          label="Critical priority"
          value={critical}
          detail="Require immediate action"
          icon={AlertTriangle}
          tone="red"
        />

        <StatCard
          label="Ambulances available"
          value={
            ambulances.filter(
              (a) => a.status === 'AVAILABLE'
            ).length
          }
          detail={`${ambulances.length} units in fleet`}
          icon={Truck}
          tone="green"
        />

        <StatCard
          label="Hospitals online"
          value={
            hospitals.filter(
              (h) => h.ed === 'Open'
            ).length
          }
          detail="Emergency departments"
          icon={Users}
          tone="green"
        />

      </div>

      {/* RESPONSE OVERVIEW */}
      <div className="mt-8 grid gap-6 xl:grid-cols-[1.35fr_.65fr]">

        <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-6">

          <SectionHeader
            title="Live response overview"
            link="View all"
            to="/emergencies"
          />

          <div className="space-y-3">

            {active.slice(0, 4).map((emergency) => (

              <Link
                to={`/analysis/${emergency.id}`}
                key={emergency.id}
                className="flex flex-col gap-3 rounded-xl border border-slate-700 bg-slate-800/40 p-4 transition hover:border-cyan-500/50 hover:bg-slate-800 sm:flex-row sm:items-center sm:justify-between"
              >

                <div className="flex items-start gap-3">

                  <div
                    className={`mt-0.5 rounded-lg p-2 ${
                      emergency.severity === 'CRITICAL'
                        ? 'bg-red-500/10 text-red-400'
                        : 'bg-amber-500/10 text-amber-400'
                    }`}
                  >
                    <Siren size={17} />
                  </div>

                  <div>

                    <p className="text-sm font-bold text-white">
                      {emergency.id}

                      <span className="ml-2 font-normal text-slate-400">
                        {emergency.type}
                      </span>
                    </p>

                    <p className="mt-1 flex items-center gap-1 text-xs text-slate-400">
                      <MapPin size={12} />
                      {emergency.location}
                    </p>

                  </div>
                </div>

                <div className="flex items-center justify-between gap-4 sm:justify-end">

                  <StatusBadge value={emergency.status} />

                  <span className="text-xs text-slate-400">
                    {emergency.time || 'Just now'}
                  </span>

                </div>

              </Link>

            ))}

            {active.length === 0 && (
              <p className="py-8 text-center text-sm text-slate-500">
                No active emergencies at the moment.
              </p>
            )}

          </div>
        </div>

        {/* NETWORK PULSE */}
        <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6 text-white">

          <SectionHeader title="Network pulse" />

          <div className="mt-5 space-y-5">

            <div>
              <div className="flex justify-between text-xs text-slate-400">
                <span>Average response time</span>
                <span className="font-bold text-white">07:42</span>
              </div>

              <div className="mt-2 h-2 rounded-full bg-white/10">
                <div className="h-2 w-[72%] rounded-full bg-emerald-400" />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs text-slate-400">
                <span>Hospital capacity</span>
                <span className="font-bold text-white">79%</span>
              </div>

              <div className="mt-2 h-2 rounded-full bg-white/10">
                <div className="h-2 w-[79%] rounded-full bg-amber-400" />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs text-slate-400">
                <span>Fleet utilization</span>
                <span className="font-bold text-white">61%</span>
              </div>

              <div className="mt-2 h-2 rounded-full bg-white/10">
                <div className="h-2 w-[61%] rounded-full bg-red-400" />
              </div>
            </div>

          </div>

          <Link
            to="/analytics"
            className="mt-8 flex items-center justify-between border-t border-white/10 pt-4 text-sm font-bold text-slate-300 transition hover:text-cyan-400"
          >
            Open analytics
            <ArrowRight size={16} />
          </Link>

        </div>
      </div>

      {/* NOTIFICATIONS AND TIMELINE */}
      <div className="mt-6 grid gap-6 lg:grid-cols-2">

        <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-6">

          <SectionHeader
            title="Recent notifications"
            link="See all"
            to="/notifications"
          />

          {notifications.slice(0, 3).map((item) => (

            <div
              key={item.id}
              className="flex gap-3 border-b border-slate-800 py-3 last:border-0"
            >

              <div className="rounded-lg bg-slate-800 p-2 text-cyan-400">
                <Bell size={15} />
              </div>

              <div>
                <p className="text-sm font-semibold text-white">
                  {item.title}
                </p>

                <p className="mt-1 text-xs text-slate-400">
                  {item.message}
                </p>
              </div>

            </div>

          ))}

          {notifications.length === 0 && (
            <p className="py-5 text-sm text-slate-500">
              No recent notifications.
            </p>
          )}

        </div>

        {/* RESPONSE TIMELINE */}
        <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-6">

          <SectionHeader
            title="Response timeline"
            link="Open tracking"
            to="/tracking"
          />

          <div className="relative ml-2 border-l border-slate-700 pl-6">

            {[
              'Emergency reported',
              'AI analysis complete',
              'Ambulance en route',
              'Hospital preparing'
            ].map((step, index) => (

              <div
                key={step}
                className="relative pb-4 last:pb-0"
              >

                <span
                  className={`absolute -left-[31px] top-0.5 h-3 w-3 rounded-full border-2 border-slate-900 ${
                    index < 3
                      ? 'bg-cyan-400'
                      : 'bg-slate-600'
                  }`}
                />

                <p className="text-sm font-semibold text-white">
                  {step}
                </p>

                <p className="mt-1 text-xs text-slate-400">
                  {index < 3
                    ? `${index + 1} min ago`
                    : 'Waiting for next update'}
                </p>

              </div>

            ))}

          </div>
        </div>

      </div>

      {/* FLOATING CALLBOT */}
      {isCitizen && (
        <>
          <button
            onClick={() => setCallBotOpen(true)}
            className="fixed bottom-6 right-6 z-50 flex items-center gap-3 rounded-full bg-red-500 px-5 py-3.5 font-bold text-white shadow-xl transition hover:scale-105 hover:bg-red-600"
          >
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-white/20">
              <Bot size={20} />
            </span>

            <span className="hidden sm:block">
              AI CallBot
            </span>
          </button>

          <CallBotPopup
            open={callBotOpen}
            onClose={() => setCallBotOpen(false)}
          />
        </>
      )}
    </>
  )
}
