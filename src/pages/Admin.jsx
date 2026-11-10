import React, { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import {
  Users,
  AlertTriangle,
  Activity,
  ShieldCheck,
  Server,
  Cpu,
  Database,
  Radio,
  Trash2,
  Ambulance,
  Hospital,
  Bell,
} from "lucide-react";
import { useApp } from "../context/AppContext.jsx";

function PageTitle({ title, description, right }) {
  return (
    <div className="mb-5 flex flex-wrap items-end justify-between gap-3">
      <div>
        <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-cyan-400">
          System administration
        </p>

        <h1 className="mt-1 font-display text-2xl font-bold text-white">
          {title}
        </h1>

        <p className="mt-1 text-sm text-slate-400">
          {description}
        </p>
      </div>

      {right}
    </div>
  );
}

function StatCard({ icon: Icon, label, value, sub }) {
  return (
    <div className="card p-4">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-[11px] uppercase tracking-wider text-slate-500">
            {label}
          </p>

          <p className="mt-1 font-display text-2xl font-bold text-white">
            {value}
          </p>

          <p className="mt-1 text-[10px] text-slate-500">
            {sub}
          </p>
        </div>

        <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-cyan-500/10 text-cyan-400">
          <Icon size={17} />
        </span>
      </div>
    </div>
  );
}

const ROLE_BADGE = {
  user: "st-assigned",
  admin: "st-critical",
  hospital: "st-available",
  driver: "st-busy",
};

const DEMO_USERS = [
  {
    role: "user",
    name: "Citizen Reporter",
    email: "citizen@responsai.local",
    org: "Public Response Network",
    avatarBg: "from-cyan-500 to-blue-600",
  },
  {
    role: "admin",
    name: "Response Coordinator",
    email: "admin@responsai.local",
    org: "responsAI Control Center",
    avatarBg: "from-violet-500 to-purple-700",
  },
  {
    role: "hospital",
    name: "Hospital Operations",
    email: "hospital@responsai.local",
    org: "Emergency Hospital Network",
    avatarBg: "from-emerald-500 to-teal-600",
  },
  {
    role: "driver",
    name: "Ambulance Driver",
    email: "driver@responsai.local",
    org: "Emergency Fleet",
    avatarBg: "from-orange-500 to-red-600",
  },
];

export default function Admin() {
  const {
    emergencies = [],
    ambulances = [],
    hospitals = [],
    notifications = [],
    resetDemo,
    notify,
  } = useApp();

  const navigate = useNavigate();

  const criticalCount = useMemo(
    () =>
      emergencies.filter(
        (emergency) => emergency.severity === "Critical"
      ).length,
    [emergencies]
  );

  const activeAmbulances = useMemo(
    () =>
      ambulances.filter(
        (ambulance) =>
          ambulance.status !== "AVAILABLE"
      ).length,
    [ambulances]
  );

  const unreadNotifications = useMemo(
    () =>
      notifications.filter(
        (notification) => !notification.read
      ).length,
    [notifications]
  );

  const services = [
    {
      icon: Cpu,
      name: "AI Orchestrator Core",
      latency: "42ms",
      status: "Operational",
    },
    {
      icon: Radio,
      name: "Ambulance Telemetry",
      latency: "118ms",
      status: "Operational",
    },
    {
      icon: Database,
      name: "Hospital Network Gateway",
      latency: "96ms",
      status: "Operational",
    },
    {
      icon: Server,
      name: "Notification Gateway",
      latency: "61ms",
      status: "Operational",
    },
  ];

  const handleReset = () => {
    const confirmed = window.confirm(
      "Reset all responsAI demo data?"
    );

    if (!confirmed) return;

    resetDemo();

    notify(
      "Demo data reset",
      "All emergency coordination demo data has been restored.",
      "info"
    );

    navigate("/admin");
  };

  return (
    <div className="animate-fadeUp">
      <PageTitle
        title="Admin Console"
        description="System oversight for users, services, emergencies and response operations."
        right={
          <span className="badge st-available">
            <ShieldCheck size={11} />
            Full access
          </span>
        }
      />

      {/* KPI CARDS */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          icon={Users}
          label="Demo Users"
          value={DEMO_USERS.length}
          sub="4 response roles"
        />

        <StatCard
          icon={Activity}
          label="Emergencies"
          value={emergencies.length}
          sub={`${criticalCount} critical cases`}
        />

        <StatCard
          icon={Ambulance}
          label="Active Fleet"
          value={activeAmbulances}
          sub={`${ambulances.length} total ambulances`}
        />

        <StatCard
          icon={Bell}
          label="Unread Alerts"
          value={unreadNotifications}
          sub="Coordination notifications"
        />
      </div>

      <div className="mt-5 grid gap-5 xl:grid-cols-3">
        {/* LEFT SIDE */}
        <div className="space-y-5 xl:col-span-2">

          {/* DEMO ACCOUNTS */}
          <div className="card">
            <div className="border-b border-navy-600 px-5 py-3.5">
              <h3 className="text-sm font-semibold text-white">
                Demo Accounts
              </h3>

              <p className="mt-0.5 text-[11px] text-slate-500">
                Available roles in the responsAI prototype
              </p>
            </div>

            <div className="divide-y divide-navy-600/60">
              {DEMO_USERS.map((user) => (
                <div
                  key={user.role}
                  className="flex flex-wrap items-center gap-3 px-5 py-3.5"
                >
                  <span
                    className={`flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br ${user.avatarBg} text-xs font-bold text-white`}
                  >
                    {user.name
                      .split(" ")
                      .map((word) => word[0])
                      .join("")
                      .slice(0, 2)}
                  </span>

                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-white">
                      {user.name}
                    </p>

                    <p className="text-[11px] text-slate-500">
                      {user.email} · {user.org}
                    </p>
                  </div>

                  <span
                    className={`badge ${
                      ROLE_BADGE[user.role] || "st-assigned"
                    }`}
                  >
                    {user.role}
                  </span>

                  <span className="badge st-available">
                    <span className="h-1.5 w-1.5 rounded-full bg-green-400" />
                    Active
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* EMERGENCY OVERSIGHT */}
          <div className="card">
            <div className="flex items-center justify-between border-b border-navy-600 px-5 py-3.5">
              <div>
                <h3 className="text-sm font-semibold text-white">
                  Emergency Oversight
                </h3>

                <p className="mt-0.5 text-[11px] text-slate-500">
                  Current incidents in the response network
                </p>
              </div>

              <span className="badge st-busy">
                {emergencies.length} records
              </span>
            </div>

            {emergencies.length === 0 ? (
              <div className="px-5 py-10 text-center">
                <Activity
                  size={25}
                  className="mx-auto text-slate-600"
                />

                <p className="mt-3 text-sm text-slate-500">
                  No emergency records available.
                </p>

                <button
                  type="button"
                  onClick={() => navigate("/report")}
                  className="btn-primary mt-4 !py-2 text-xs"
                >
                  Create emergency
                </button>
              </div>
            ) : (
              <div className="divide-y divide-navy-600/60">
                {emergencies.slice(0, 6).map((emergency) => (
                  <div
                    key={emergency.id}
                    className="flex flex-wrap items-center gap-3 px-5 py-3.5"
                  >
                    <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-red-500/10 text-red-400">
                      <AlertTriangle size={16} />
                    </span>

                    <div className="min-w-0 flex-1">
                      <p className="font-mono text-xs font-medium text-cyan-300">
                        {emergency.id}
                      </p>

                      <p className="mt-0.5 truncate text-xs text-slate-400">
                        {emergency.summary ||
                          emergency.description ||
                          "Emergency reported"}
                      </p>
                    </div>

                    <span className="badge st-critical">
                      {emergency.severity || "Unknown"}
                    </span>

                    <span className="badge st-assigned">
                      {emergency.status || "Reported"}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* HOSPITAL NETWORK */}
          <div className="card">
            <div className="border-b border-navy-600 px-5 py-3.5">
              <h3 className="text-sm font-semibold text-white">
                Hospital Network
              </h3>
            </div>

            <div className="divide-y divide-navy-600/60">
              {hospitals.slice(0, 5).map((hospital) => (
                <div
                  key={hospital.id}
                  className="flex items-center gap-3 px-5 py-3"
                >
                  <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-400">
                    <Hospital size={15} />
                  </span>

                  <div className="min-w-0 flex-1">
                    <p className="truncate text-xs font-medium text-white">
                      {hospital.name}
                    </p>

                    <p className="text-[10px] text-slate-500">
                      {hospital.location ||
                        hospital.address ||
                        "Emergency network"}
                    </p>
                  </div>

                  <span className="badge st-available">
                    Online
                  </span>
                </div>
              ))}

              {hospitals.length === 0 && (
                <p className="px-5 py-6 text-center text-xs text-slate-500">
                  No hospital data available.
                </p>
              )}
            </div>
          </div>
        </div>

        {/* RIGHT SIDE */}
        <div className="space-y-5">

          {/* SERVICE HEALTH */}
          <div className="card p-5">
            <h3 className="text-sm font-semibold text-white">
              Service Health
            </h3>

            <div className="mt-3 space-y-2.5">
              {services.map((service) => {
                const Icon = service.icon;

                return (
                  <div
                    key={service.name}
                    className="flex items-center gap-3 rounded-xl bg-navy-900/60 px-3.5 py-3"
                  >
                    <Icon
                      size={16}
                      className="text-cyan-400"
                    />

                    <div className="min-w-0 flex-1">
                      <p className="truncate text-xs font-medium text-white">
                        {service.name}
                      </p>

                      <p className="text-[10px] text-slate-500">
                        latency {service.latency}
                      </p>
                    </div>

                    <span className="badge st-available">
                      {service.status}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* FLEET STATUS */}
          <div className="card p-5">
            <div className="flex items-center gap-2">
              <Ambulance
                size={17}
                className="text-cyan-400"
              />

              <h3 className="text-sm font-semibold text-white">
                Fleet Status
              </h3>
            </div>

            <div className="mt-3 space-y-2">
              {ambulances.slice(0, 5).map((ambulance) => (
                <div
                  key={ambulance.id}
                  className="flex items-center justify-between rounded-xl bg-navy-900/60 px-3.5 py-2.5"
                >
                  <div>
                    <p className="font-mono text-xs text-cyan-300">
                      {ambulance.id}
                    </p>

                    <p className="text-[10px] text-slate-500">
                      {ambulance.driver ||
                        ambulance.name ||
                        "Response unit"}
                    </p>
                  </div>

                  <span
                    className={`badge ${
                      ambulance.status === "AVAILABLE"
                        ? "st-available"
                        : "st-busy"
                    }`}
                  >
                    {ambulance.status || "UNKNOWN"}
                  </span>
                </div>
              ))}

              {ambulances.length === 0 && (
                <p className="py-5 text-center text-xs text-slate-500">
                  No ambulance data available.
                </p>
              )}
            </div>
          </div>

          {/* SYSTEM INFO */}
          <div className="card p-5">
            <h3 className="text-sm font-semibold text-white">
              System Information
            </h3>

            <div className="mt-3 space-y-2">
              <div className="flex justify-between text-xs">
                <span className="text-slate-500">
                  Frontend
                </span>

                <span className="text-slate-300">
                  React + Vite
                </span>
              </div>

              <div className="flex justify-between text-xs">
                <span className="text-slate-500">
                  Data storage
                </span>

                <span className="text-slate-300">
                  LocalStorage
                </span>
              </div>

              <div className="flex justify-between text-xs">
                <span className="text-slate-500">
                  AI engine
                </span>

                <span className="text-cyan-300">
                  Demo rules
                </span>
              </div>

              <div className="flex justify-between text-xs">
                <span className="text-slate-500">
                  Hospitals
                </span>

                <span className="text-slate-300">
                  {hospitals.length}
                </span>
              </div>
            </div>
          </div>

          {/* RESET */}
          <button
            type="button"
            onClick={handleReset}
            className="btn-danger w-full !py-2.5 text-xs"
          >
            <Trash2 size={13} />
            Reset all demo data
          </button>
        </div>
      </div>
    </div>
  );
}