
import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  MapPin,
  Mic,
  Image as ImageIcon,
  Paperclip,
  Send,
  AlertTriangle,
  ShieldCheck,
  Navigation,
  Phone,
} from 'lucide-react'

import { useApp } from '../context/AppContext'
import { PageTitle } from '../components/common/UI'

export default function EmergencyReport() {
  const navigate = useNavigate()
  const { createEmergency } = useApp()

  const [form, setForm] = useState({
    type: 'Road Accident',
    description: '',
    location: '',
    contact: '',
  })

  const [locating, setLocating] = useState(false)
  const [listening, setListening] = useState(false)
  const [submitting, setSubmitting] = useState(false)

  const update = (field, value) => {
    setForm((current) => ({
      ...current,
      [field]: value,
    }))
  }

  const locate = () => {
    if (!navigator.geolocation) {
      update('location', 'GPS unavailable - enter location manually')
      return
    }

    setLocating(true)

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const latitude = position.coords.latitude.toFixed(6)
        const longitude = position.coords.longitude.toFixed(6)

        update('location', `GPS: ${latitude}, ${longitude}`)
        setLocating(false)
      },
      () => {
        update('location', 'Unable to access GPS - enter location manually')
        setLocating(false)
      }
    )
  }

  const voice = () => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition

    if (!SpeechRecognition) {
      alert('Voice recognition is not supported in this browser.')
      return
    }

    const recognition = new SpeechRecognition()

    recognition.lang = 'en-IN'
    recognition.interimResults = false
    recognition.continuous = false

    recognition.onstart = () => setListening(true)

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript

      setForm((current) => ({
        ...current,
        description: current.description
          ? `${current.description} ${transcript}`
          : transcript,
      }))
    }

    recognition.onerror = () => setListening(false)
    recognition.onend = () => setListening(false)

    recognition.start()
  }

  const submit = async (event) => {
    event.preventDefault()

    if (!form.description.trim()) {
      alert('Please describe the emergency.')
      return
    }

    if (!form.location.trim()) {
      alert('Please provide the emergency location.')
      return
    }

    setSubmitting(true)

    try {
      const result = createEmergency({
        ...form,
        time: 'Just now',
      })

      if (result?.emergency?.id) {
        navigate(`/analysis/${result.emergency.id}`)
      } else {
        navigate('/dashboard')
      }
    } catch (error) {
      console.error('Emergency creation failed:', error)
      alert('Unable to create the emergency. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  const inputClass =
    'w-full rounded-2xl border border-slate-700 bg-slate-800/80 px-4 py-3 text-sm text-white placeholder:text-slate-500 outline-none transition focus:border-cyan-400 focus:ring-4 focus:ring-cyan-500/10'

  const labelClass =
    'mb-2 block text-sm font-semibold text-slate-300'

  return (
    <>
      <PageTitle
        eyebrow="Emergency intake"
        title="Report an emergency"
        description="Share what is happening. The response network will classify the incident and recommend the next best action."
      />

      <div className="grid gap-6 lg:grid-cols-[1.4fr_0.8fr]">

        {/* Main form */}
        <form
          onSubmit={submit}
          className="rounded-3xl border border-slate-800 bg-slate-900/70 p-6 shadow-sm"
        >
          <div className="mb-6 flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-red-500/10 text-red-400">
              <AlertTriangle size={24} />
            </div>

            <div>
              <h2 className="text-lg font-semibold text-white">
                Emergency details
              </h2>
              <p className="text-sm text-slate-400">
                Give the response network enough information to act quickly.
              </p>
            </div>
          </div>

          {/* Emergency type */}
          <div className="mb-5">
            <label className={labelClass}>Emergency type</label>

            <select
              value={form.type}
              onChange={(event) => update('type', event.target.value)}
              className={inputClass}
            >
              <option className="bg-slate-900" value="Road Accident">Road Accident</option>
              <option className="bg-slate-900" value="Medical Emergency">Medical Emergency</option>
              <option className="bg-slate-900" value="Fire">Fire</option>
              <option className="bg-slate-900" value="Flood">Flood</option>
              <option className="bg-slate-900" value="Other Disaster">Other Disaster</option>
            </select>
          </div>

          {/* Contact */}
          <div className="mb-5">
            <label className={labelClass}>Emergency contact</label>

            <div className="relative">
              <Phone
                size={18}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500"
              />

              <input
                type="tel"
                value={form.contact}
                onChange={(event) => update('contact', event.target.value)}
                placeholder="Enter phone number"
                className={`${inputClass} pl-11`}
              />
            </div>
          </div>

          {/* Description */}
          <div className="mb-5">
            <div className="mb-2 flex items-center justify-between gap-3">
              <label className="block text-sm font-semibold text-slate-300">
                What happened?
              </label>

              <button
                type="button"
                onClick={voice}
                className={`flex items-center gap-2 rounded-xl px-3 py-2 text-xs font-semibold transition ${
                  listening
                    ? 'bg-red-500/10 text-red-400'
                    : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                }`}
              >
                <Mic size={15} />
                {listening ? 'Listening...' : 'Use voice'}
              </button>
            </div>

            <textarea
              value={form.description}
              onChange={(event) => update('description', event.target.value)}
              rows={6}
              placeholder="Example: Two vehicles collided near the main junction. One person appears injured..."
              className={`${inputClass} resize-none`}
            />
          </div>

          {/* Location */}
          <div className="mb-5">
            <label className={labelClass}>Emergency location</label>

            <div className="flex flex-col gap-2 sm:flex-row">
              <div className="relative flex-1">
                <MapPin
                  size={18}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500"
                />

                <input
                  type="text"
                  value={form.location}
                  onChange={(event) => update('location', event.target.value)}
                  placeholder="Enter location or use GPS"
                  className={`${inputClass} pl-11`}
                />
              </div>

              <button
                type="button"
                onClick={locate}
                disabled={locating}
                className="flex items-center justify-center gap-2 rounded-2xl border border-slate-700 bg-slate-800 px-4 py-3 text-sm font-semibold text-cyan-400 transition hover:border-cyan-500/50 hover:bg-slate-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                <Navigation size={17} />
                {locating ? 'Locating...' : 'GPS'}
              </button>
            </div>
          </div>

          {/* Attachments */}
          <div className="mb-6">
            <label className={labelClass}>
              Add supporting information
            </label>

            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
              <button
                type="button"
                onClick={() => alert('Image upload is available in the demo UI.')}
                className="flex items-center justify-center gap-2 rounded-2xl border border-dashed border-slate-700 bg-slate-800/40 px-4 py-4 text-sm font-medium text-slate-300 transition hover:border-cyan-500 hover:bg-slate-800"
              >
                <ImageIcon size={18} />
                Image
              </button>

              <button
                type="button"
                onClick={() => alert('File upload is available in the demo UI.')}
                className="flex items-center justify-center gap-2 rounded-2xl border border-dashed border-slate-700 bg-slate-800/40 px-4 py-4 text-sm font-medium text-slate-300 transition hover:border-cyan-500 hover:bg-slate-800"
              >
                <Paperclip size={18} />
                File
              </button>

              <button
                type="button"
                onClick={voice}
                className="col-span-2 flex items-center justify-center gap-2 rounded-2xl border border-dashed border-slate-700 bg-slate-800/40 px-4 py-4 text-sm font-medium text-slate-300 transition hover:border-cyan-500 hover:bg-slate-800 sm:col-span-1"
              >
                <Mic size={18} />
                Voice
              </button>
            </div>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={submitting}
            className="flex w-full items-center justify-center gap-2 rounded-2xl bg-cyan-500 px-5 py-4 text-sm font-bold text-slate-950 shadow-lg shadow-cyan-500/10 transition hover:bg-cyan-400 disabled:cursor-not-allowed disabled:opacity-60"
          >
            <Send size={18} />
            {submitting ? 'Creating emergency...' : 'Submit emergency report'}
          </button>
        </form>

        {/* Right information panel */}
        <div className="space-y-5">

          <div className="rounded-3xl border border-cyan-500/20 bg-gradient-to-br from-slate-900 to-slate-800 p-6 text-white shadow-sm">
            <div className="mb-4 flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-cyan-500/10 text-cyan-400">
                <ShieldCheck size={23} />
              </div>

              <div>
                <p className="text-sm font-semibold">responsAI network</p>
                <p className="text-xs text-slate-400">
                  AI emergency coordination
                </p>
              </div>
            </div>

            <h3 className="mb-2 text-xl font-semibold">
              Every second matters.
            </h3>

            <p className="text-sm leading-6 text-slate-300">
              Your report is analyzed to determine emergency type,
              severity and the most appropriate response.
            </p>
          </div>

          <div className="rounded-3xl border border-slate-800 bg-slate-900/70 p-6 shadow-sm">
            <h3 className="mb-4 font-semibold text-white">
              What happens next?
            </h3>

            <div className="space-y-4">
              {[
                {
                  title: 'AI classification',
                  description: 'The system identifies the emergency type and severity.',
                },
                {
                  title: 'Best response matching',
                  description: 'Hospitals and ambulances are matched based on response requirements.',
                },
                {
                  title: 'Response coordination',
                  description: 'The response workflow coordinates the ambulance and hospital.',
                },
                {
                  title: 'Live tracking',
                  description: 'Track the emergency response through the dashboard.',
                },
              ].map((step, index) => (
                <div key={step.title} className="flex gap-3">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-cyan-500/20 bg-cyan-500/10 text-xs font-bold text-cyan-400">
                    {index + 1}
                  </div>

                  <div>
                    <p className="text-sm font-semibold text-slate-200">
                      {step.title}
                    </p>
                    <p className="text-xs leading-5 text-slate-400">
                      {step.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-3xl border border-amber-500/20 bg-amber-500/10 p-5">
            <div className="flex gap-3">
              <AlertTriangle
                size={20}
                className="mt-0.5 shrink-0 text-amber-400"
              />

              <div>
                <h4 className="text-sm font-semibold text-amber-300">
                  For immediate danger
                </h4>

                <p className="mt-1 text-xs leading-5 text-amber-200/80">
                  This is a prototype emergency coordination system.
                  For a real emergency, contact your local emergency
                  services as well.
                </p>
              </div>
            </div>
          </div>

        </div>
      </div>
    </>
  )
}


