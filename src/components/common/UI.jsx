
import {
  AlertTriangle,
  ArrowUpRight,
  CheckCircle2,
  Clock3,
  MapPin,
  ShieldCheck,
  Siren,
  Users
} from 'lucide-react'

import { Link } from 'react-router-dom'

// PAGE TITLE
export function PageTitle({
  eyebrow = 'Operations',
  title,
  description,
  action
}) {
  return (
    <div className="mb-7 flex flex-col justify-between gap-4 md:flex-row md:items-end">
      <div>
        <p className="text-xs font-bold uppercase tracking-[0.18em] text-cyan-400">
          {eyebrow}
        </p>

        <h1 className="mt-1 text-3xl font-bold tracking-tight text-white">
          {title}
        </h1>

        {description && (
          <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-400">
            {description}
          </p>
        )}
      </div>

      {action}
    </div>
  )
}

// STATUS BADGE
export function StatusBadge({ value }) {
  const good = [
    'AVAILABLE',
    'Open',
    'Resolved',
    'Hospital accepted',
    'At hospital',
    'Handover completed'
  ].includes(value)

  const urgent = [
    'CRITICAL',
    'DISPATCHED',
    'EN ROUTE',
    'TRANSPORTING'
  ].includes(value)

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-bold ${
        good
          ? 'bg-emerald-500/10 text-emerald-400'
          : urgent
          ? 'bg-red-500/10 text-red-400'
          : 'bg-amber-500/10 text-amber-400'
      }`}
    >
      <span className="h-1.5 w-1.5 rounded-full bg-current" />
      {value}
    </span>
  )
}

// STATISTICS CARD
export function StatCard({
  label,
  value,
  detail,
  icon: Icon = ShieldCheck,
  tone = 'navy'
}) {
  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-5 transition hover:border-slate-700">

      <div className="flex items-start justify-between">

        <div>
          <p className="text-sm font-medium text-slate-400">
            {label}
          </p>

          <p className="mt-2 text-3xl font-bold text-white">
            {value}
          </p>

          <p className="mt-1 text-xs text-slate-500">
            {detail}
          </p>
        </div>

        <div
          className={`rounded-xl p-3 ${
            tone === 'red'
              ? 'bg-red-500/10 text-red-400'
              : tone === 'green'
              ? 'bg-emerald-500/10 text-emerald-400'
              : 'bg-cyan-500/10 text-cyan-400'
          }`}
        >
          <Icon size={20} />
        </div>

      </div>
    </div>
  )
}

// EMPTY STATE
export function EmptyState({ title, text, action }) {
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border border-slate-800 bg-slate-900/70 p-12 text-center">

      <div className="mb-3 rounded-full bg-slate-800 p-4 text-cyan-400">
        <Siren size={24} />
      </div>

      <h3 className="font-bold text-white">
        {title}
      </h3>

      <p className="mt-1 max-w-sm text-sm text-slate-400">
        {text}
      </p>

      {action && (
        <div className="mt-5">
          {action}
        </div>
      )}

    </div>
  )
}

// SECTION HEADER
export function SectionHeader({ title, link, to = '#' }) {
  return (
    <div className="mb-4 flex items-center justify-between">

      <h2 className="font-bold text-white">
        {title}
      </h2>

      {link && (
        <Link
          to={to}
          className="flex items-center gap-1 text-xs font-bold text-cyan-400 transition hover:text-cyan-300"
        >
          {link}
          <ArrowUpRight size={14} />
        </Link>
      )}

    </div>
  )
}

// ICON MAPPING
export const iconFor = {
  critical: AlertTriangle,
  response: Clock3,
  location: MapPin,
  people: Users,
  check: CheckCircle2
}
