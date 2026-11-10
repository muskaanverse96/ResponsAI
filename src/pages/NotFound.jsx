import { Compass, ArrowLeft } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

export default function NotFound() {
  const navigate = useNavigate()

  return (
    <div className="grid-bg flex min-h-screen flex-col items-center justify-center bg-navy px-4 text-center text-white">

      <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-red-500/10 text-red-400">
        <Compass size={36} />
      </div>

      <p className="mt-6 text-xs font-bold uppercase tracking-[0.2em] text-red-400">
        responsAI
      </p>

      <h1 className="mt-2 text-6xl font-bold">
        404
      </h1>

      <h2 className="mt-3 text-xl font-bold">
        Route not found
      </h2>

      <p className="mt-2 max-w-md text-sm leading-6 text-slate-400">
        This route is off the response map. The page you're looking for
        doesn't exist or may have been moved.
      </p>

      <button
        onClick={() => navigate('/')}
        className="btn-primary mt-7"
      >
        <ArrowLeft size={17} />
        Back to responsAI
      </button>

    </div>
  )
}