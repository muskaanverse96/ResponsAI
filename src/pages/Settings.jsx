
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  User,
  Bell,
  Volume2,
  MapPin,
  RefreshCw,
  Trash2,
  ShieldCheck,
  CheckCircle2,
} from "lucide-react";
import { useApp } from "../context/AppContext.jsx";

function Toggle({ on, onChange }) {
  return (
    <button
      type="button"
      onClick={() => onChange(!on)}
      className={`relative h-6 w-11 shrink-0 rounded-full transition ${
        on ? "bg-cyan-500" : "bg-slate-700"
      }`}
      aria-label="Toggle setting"
      aria-pressed={on}
    >
      <span
        className={`absolute top-0.5 h-5 w-5 rounded-full bg-white transition-all ${
          on ? "left-[22px]" : "left-0.5"
        }`}
      />
    </button>
  );
}

function PageTitle({ title, description }) {
  return (
    <div className="mb-5">
      <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-cyan-400">
        System preferences
      </p>

      <h1 className="mt-1 font-display text-2xl font-bold text-white">
        {title}
      </h1>

      <p className="mt-1 text-sm text-slate-400">
        {description}
      </p>
    </div>
  );
}

export default function Settings() {
  const { user, resetDemo, notify } = useApp();
  const navigate = useNavigate();

  const [prefs, setPrefs] = useState({
    notif: true,
    sound: true,
    location: true,
    autoFamily: true,
  });

  const initials =
    user?.name
      ?.split(" ")
      .filter(Boolean)
      .map((word) => word[0])
      .join("")
      .slice(0, 2)
      .toUpperCase() || "RS";

  const updatePreference = (key, value) => {
    setPrefs((current) => ({
      ...current,
      [key]: value,
    }));
  };

  const handleReset = () => {
    const confirmed = window.confirm(
      "Reset all responsAI demo data to the original seed state?"
    );

    if (!confirmed) return;

    resetDemo();

    notify(
      "Demo data reset",
      "Emergencies, ambulances and notifications were restored.",
      "info"
    );

    navigate("/dashboard");
  };

  const handleHardReload = () => {
    window.location.reload();
  };

  const preferenceItems = [
    {
      key: "notif",
      icon: Bell,
      label: "Push notifications",
      desc: "Assignments, confirmations and emergency alerts",
    },
    {
      key: "sound",
      icon: Volume2,
      label: "Emergency sounds",
      desc: "Audible alert for critical response events",
    },
    {
      key: "location",
      icon: MapPin,
      label: "Share precise location",
      desc: "Attach GPS information to new emergency reports",
    },
    {
      key: "autoFamily",
      icon: User,
      label: "Auto family notification",
      desc: "Notify emergency contacts after ambulance dispatch",
    },
  ];

  return (
    <div className="animate-fadeUp mx-auto max-w-3xl">
      <PageTitle
        title="Settings"
        description="Account, preferences and demo data controls."
      />

      {/* ACCOUNT */}
      <div className="mb-5 flex items-center gap-4 rounded-2xl border border-slate-800 bg-slate-900/70 p-5">
        <span
          className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br ${
            user?.avatarBg || "from-cyan-500 to-blue-600"
          } font-display text-lg font-bold text-white`}
        >
          {initials}
        </span>

        <div className="min-w-0">
          <p className="font-semibold text-white">
            {user?.name || "Demo User"}
          </p>

          <p className="truncate text-xs text-slate-400">
            {user?.email || "demo@responsai.local"}
          </p>

          <p className="mt-0.5 text-[11px] capitalize text-cyan-300">
            {user?.role === "user"
              ? "Citizen / Reporter"
              : user?.role || "Citizen"}{" "}
            {user?.org ? `· ${user.org}` : ""}
          </p>
        </div>

        <span className="ml-auto hidden shrink-0 items-center gap-1 rounded-full border border-green-500/20 bg-green-500/10 px-2.5 py-1 text-[10px] font-medium text-green-400 sm:flex">
          <ShieldCheck size={11} />
          Demo session
        </span>
      </div>

      {/* PREFERENCES */}
      <div className="mb-5 rounded-2xl border border-slate-800 bg-slate-900/70 p-5">
        <div className="flex items-center gap-2">
          <Bell size={17} className="text-cyan-400" />

          <h3 className="text-sm font-semibold text-white">
            Preferences
          </h3>
        </div>

        <div className="mt-4 divide-y divide-slate-800">
          {preferenceItems.map((item) => {
            const Icon = item.icon;

            return (
              <div
                key={item.key}
                className="flex items-center gap-3 py-3.5"
              >
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-cyan-500/10">
                  <Icon size={17} className="text-cyan-400" />
                </span>

                <div className="min-w-0 flex-1">
                  <p className="text-sm text-slate-200">
                    {item.label}
                  </p>

                  <p className="text-[11px] text-slate-500">
                    {item.desc}
                  </p>
                </div>

                <Toggle
                  on={prefs[item.key]}
                  onChange={(value) =>
                    updatePreference(item.key, value)
                  }
                />
              </div>
            );
          })}
        </div>
      </div>

      {/* EMERGENCY CONTACTS */}
      <div className="mb-5 rounded-2xl border border-slate-800 bg-slate-900/70 p-5">
        <div className="flex items-center gap-2">
          <User size={17} className="text-cyan-400" />

          <h3 className="text-sm font-semibold text-white">
            Emergency Contacts
          </h3>
        </div>

        <p className="mt-1 text-xs text-slate-500">
          Contacts that can be notified during an emergency.
        </p>

        <div className="mt-4 space-y-2">
          <div className="flex items-center justify-between gap-3 rounded-xl border border-slate-800 bg-slate-800/70 px-4 py-3">
            <div>
              <p className="text-sm text-slate-200">
                Primary Emergency Contact
              </p>

              <p className="text-[11px] text-slate-500">
                Family / trusted contact
              </p>
            </div>

            <span className="shrink-0 text-xs text-slate-400">
              Configured in demo
            </span>
          </div>

          <div className="flex items-center justify-between gap-3 rounded-xl border border-slate-800 bg-slate-800/70 px-4 py-3">
            <div>
              <p className="text-sm text-slate-200">
                Response Coordinator
              </p>

              <p className="text-[11px] text-slate-500">
                Coordination network contact
              </p>
            </div>

            <span className="shrink-0 text-xs text-slate-400">
              responsAI network
            </span>
          </div>
        </div>
      </div>

      {/* DEMO STATUS */}
      <div className="mb-5 rounded-2xl border border-slate-800 bg-slate-900/70 p-5">
        <div className="flex items-start gap-3">
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-cyan-500/10 text-cyan-400">
            <CheckCircle2 size={17} />
          </span>

          <div>
            <h3 className="text-sm font-semibold text-white">
              Prototype status
            </h3>

            <p className="mt-1 text-xs leading-relaxed text-slate-400">
              responsAI currently runs using local demo data,
              simulated emergency coordination and browser-based
              interactions.
            </p>
          </div>
        </div>
      </div>

      {/* DANGER ZONE */}
      <div className="rounded-2xl border border-red-500/25 bg-slate-900/70 p-5">
        <div className="flex items-center gap-2">
          <Trash2 size={16} className="text-red-400" />

          <h3 className="text-sm font-semibold text-red-300">
            Danger Zone
          </h3>
        </div>

        <p className="mt-1 text-xs text-slate-400">
          Reset the current demo data including emergencies,
          ambulance states and notifications.
        </p>

        <div className="mt-4 flex flex-wrap gap-2">
          <button
            type="button"
            onClick={handleReset}
            className="flex items-center justify-center gap-2 rounded-xl bg-red-500 px-4 py-2 text-xs font-semibold text-white transition hover:bg-red-400"
          >
            <Trash2 size={13} />
            Reset demo data
          </button>

          <button
            type="button"
            onClick={handleHardReload}
            className="flex items-center justify-center gap-2 rounded-xl border border-slate-700 bg-slate-800 px-4 py-2 text-xs font-semibold text-slate-300 transition hover:border-cyan-500/50 hover:text-cyan-400"
          >
            <RefreshCw size={13} />
            Hard reload
          </button>
        </div>
      </div>

      <p className="mt-6 text-center text-[10px] leading-relaxed text-slate-500">
        responsAI is a prototype concept for emergency coordination
        and demonstration purposes. It does not replace professional
        emergency services or medical judgment.
      </p>
    </div>
  );
}
