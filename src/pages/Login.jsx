
import {
  ArrowLeft,
  CheckCircle2,
  LockKeyhole,
  Siren,
  Bot
} from 'lucide-react'
import { Link, useNavigate } from 'react-router-dom'
import { useApp } from '../context/AppContext'
import { useState } from 'react'
import CallBotPopup from '../components/common/CallBotPopup'

const roles = [
  {
    role: 'Admin',
    name: 'Avery Morgan',
    description: 'Emergency Coordinator'
  },
  {
    role: 'Citizen',
    name: 'Nadia Brooks',
    description: 'Report and track emergencies'
  },
  {
    role: 'Hospital',
    name: 'Mercy General Desk',
    description: 'Receive incoming cases'
  },
  {
    role: 'Ambulance Driver',
    name: 'Jordan Lee',
    description: 'Manage dispatch and handover'
  }
]

export default function Login() {
  const [selected, setSelected] = useState(roles[0])
  const [callBotOpen, setCallBotOpen] = useState(false)

  const { setUser } = useApp()
  const navigate = useNavigate()

  const login = () => {
    setUser(selected)

    navigate(
      selected.role === 'Hospital'
        ? '/hospital-panel'
        : selected.role === 'Ambulance Driver'
          ? '/driver'
          : '/dashboard'
    )
  }

  return (
    <>
      <div className="min-h-screen bg-[#080f1e] px-5 py-8 text-white">

        {/* Back navigation */}
        <Link
          to="/"
          className="mx-auto flex max-w-6xl items-center gap-2 text-sm text-slate-400 transition hover:text-cyan-400"
        >
          <ArrowLeft size={16} />
          Back to responsAI
        </Link>

        <div className="mx-auto grid max-w-5xl gap-12 py-14 lg:grid-cols-[.85fr_1.15fr] lg:items-center">

          {/* Left information panel */}
          <div>
            <span className="inline-flex rounded-xl border border-cyan-500/20 bg-cyan-500/10 p-3 text-cyan-400">
              <Siren size={24} />
            </span>

            <p className="mt-6 text-xs font-bold uppercase tracking-[0.2em] text-cyan-400">
              Emergency response platform
            </p>

            <h1 className="mt-3 text-4xl font-bold leading-tight text-white">
              Enter the response network.
            </h1>

            <p className="mt-4 leading-7 text-slate-400">
              Choose a demo role to explore how responsAI coordinates a live
              emergency from different perspectives.
            </p>

            <div className="mt-8 space-y-4 text-sm text-slate-300">
              <p className="flex items-center gap-3">
                <CheckCircle2 size={17} className="shrink-0 text-emerald-400" />
                Every action is local and persisted in your browser.
              </p>

              <p className="flex items-center gap-3">
                <CheckCircle2 size={17} className="shrink-0 text-emerald-400" />
                No real credentials or external services required.
              </p>
            </div>

            <div className="mt-10 flex items-center gap-3 border-t border-slate-800 pt-6">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-500/10 text-cyan-400">
                <ShieldIcon />
              </div>
              <div>
                <p className="text-sm font-semibold text-white">
                  ResponsAI Network
                </p>
                <p className="text-xs text-slate-500">
                  Intelligent emergency coordination
                </p>
              </div>
            </div>
          </div>

          {/* Role selection card */}
          <div className="rounded-3xl border border-slate-800 bg-slate-900/80 p-7 shadow-2xl shadow-black/20">

            <p className="text-xs font-bold uppercase tracking-[0.18em] text-cyan-400">
              Prototype access
            </p>

            <h2 className="mt-2 text-2xl font-bold text-white">
              Select your role
            </h2>

            <p className="mt-2 text-sm text-slate-400">
              Choose a role to access its respective dashboard.
            </p>

            <div className="mt-6 grid gap-3 sm:grid-cols-2">

              {roles.map((item) => (
                <button
                  key={item.role}
                  onClick={() => setSelected(item)}
                  className={`rounded-2xl border p-4 text-left transition ${
                    selected.role === item.role
                      ? 'border-cyan-400 bg-cyan-500/10 ring-2 ring-cyan-500/10'
                      : 'border-slate-700 bg-slate-800/50 hover:border-slate-500 hover:bg-slate-800'
                  }`}
                >
                  <div className="flex items-center justify-between gap-2">
                    <p className={`font-bold ${
                      selected.role === item.role
                        ? 'text-cyan-300'
                        : 'text-white'
                    }`}>
                      {item.role}
                    </p>

                    {selected.role === item.role && (
                      <CheckCircle2
                        size={18}
                        className="text-cyan-400"
                      />
                    )}
                  </div>

                  <p className="mt-1 text-xs text-slate-400">
                    {item.name}
                  </p>

                  <p className="mt-3 text-xs leading-5 text-slate-500">
                    {item.description}
                  </p>
                </button>
              ))}

            </div>

            {/* Demo access information */}
            <div className="mt-6 rounded-xl border border-slate-700 bg-slate-800/70 p-4 text-sm">
              <p className="font-semibold text-slate-200">
                Demo access
              </p>

              <p className="mt-1 text-slate-400">
                Any selection signs in as {selected.name}.
                Password is not required.
              </p>
            </div>

            {/* Login button */}
            <button
              onClick={login}
              className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-cyan-500 px-5 py-3.5 text-sm font-bold text-slate-950 shadow-lg shadow-cyan-500/10 transition hover:bg-cyan-400"
            >
              <LockKeyhole size={17} />
              Continue as {selected.role}
            </button>

          </div>
        </div>
      </div>

      {/* Floating CallBot */}
      <button
        onClick={() => setCallBotOpen(true)}
        className="fixed bottom-6 right-6 z-50 flex items-center gap-3 rounded-full bg-cyan-500 px-5 py-3.5 font-bold text-slate-950 shadow-xl shadow-cyan-500/20 transition hover:scale-105 hover:bg-cyan-400"
      >
        <span className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-950/10">
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
  )
}

function ShieldIcon() {
  return <CheckCircle2 size={20} />
}
