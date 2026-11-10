import React, { useMemo, useState } from "react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  Legend,
} from "recharts";
import {
  BarChart3,
  Activity,
  Ambulance,
  AlertTriangle,
  Clock,
} from "lucide-react";
import { useApp } from "../context/AppContext.jsx";

const COLORS = [
  "#22D3EE",
  "#3B82F6",
  "#F97316",
  "#A855F7",
  "#64748B",
];

const SEVERITY_COLORS = {
  Critical: "#EF4444",
  High: "#F97316",
  Medium: "#EAB308",
  Low: "#22C55E",
};

const RANGES = ["Today", "7 Days", "30 Days"];

export default function Analytics() {
  const { emergencies, ambulances, hospitals } = useApp();

  const [range, setRange] = useState("Today");

  // -----------------------------------------
  // EMERGENCY TYPE DATA
  // -----------------------------------------

  const typeData = useMemo(() => {
    const counts = {};

    (emergencies || []).forEach((emergency) => {
      const type = emergency.type || "Other";

      counts[type] = (counts[type] || 0) + 1;
    });

    if (Object.keys(counts).length === 0) {
      return [
        { name: "Medical", value: 0 },
        { name: "Road Accident", value: 0 },
        { name: "Fire", value: 0 },
        { name: "Flood", value: 0 },
        { name: "Other", value: 0 },
      ];
    }

    return Object.entries(counts).map(([name, value]) => ({
      name,
      value,
    }));
  }, [emergencies]);

  // -----------------------------------------
  // SEVERITY DATA
  // -----------------------------------------

  const severityData = useMemo(() => {
    const counts = {
      Critical: 0,
      High: 0,
      Medium: 0,
      Low: 0,
    };

    (emergencies || []).forEach((emergency) => {
      const severity = emergency.severity;

      if (counts[severity] !== undefined) {
        counts[severity]++;
      }
    });

    return Object.entries(counts).map(([name, value]) => ({
      name,
      value,
    }));
  }, [emergencies]);

  // -----------------------------------------
  // RESPONSE TIME DATA
  // -----------------------------------------

  const responseData = useMemo(() => {
    const base = range === "Today" ? 8 : range === "7 Days" ? 9 : 10;

    return [
      { h: "06:00", min: base + 1 },
      { h: "09:00", min: base },
      { h: "12:00", min: base - 1 },
      { h: "15:00", min: base },
      { h: "18:00", min: base + 1 },
      { h: "21:00", min: base - 1 },
    ];
  }, [range]);

  // -----------------------------------------
  // AMBULANCE AVAILABILITY
  // -----------------------------------------

  const ambulanceData = useMemo(() => {
    const total = ambulances?.length || 0;

    const available =
      ambulances?.filter(
        (ambulance) =>
          ambulance.status === "AVAILABLE"
      ).length || 0;

    return [
      {
        h: "06:00",
        avail: Math.max(0, available - 1),
      },
      {
        h: "09:00",
        avail: available,
      },
      {
        h: "12:00",
        avail: Math.max(0, available - 1),
      },
      {
        h: "15:00",
        avail: available,
      },
      {
        h: "18:00",
        avail: Math.max(0, available - 1),
      },
      {
        h: "21:00",
        avail: available,
      },
    ];
  }, [ambulances]);

  // -----------------------------------------
  // HOSPITAL CAPACITY
  // -----------------------------------------

  const hospitalCapacity = useMemo(() => {
    return (hospitals || []).map((hospital) => {
      const capacity =
        hospital.capacity ||
        hospital.occupancy ||
        hospital.occupied ||
        Math.floor(50 + Math.random() * 35);

      return {
        name: hospital.name || "Hospital",
        cap: Math.min(100, Number(capacity)),
      };
    });
  }, [hospitals]);

  // -----------------------------------------
  // KPI VALUES
  // -----------------------------------------

  const totalEmergencies = emergencies?.length || 0;

  const criticalEmergencies =
    emergencies?.filter(
      (emergency) => emergency.severity === "Critical"
    ).length || 0;

  const availableAmbulances =
    ambulances?.filter(
      (ambulance) => ambulance.status === "AVAILABLE"
    ).length || 0;

  const totalAmbulances = ambulances?.length || 0;

  const escalations =
    emergencies?.filter(
      (emergency) =>
        emergency.status?.toLowerCase().includes("escalat")
    ).length || 0;

  return (
    <div className="space-y-6 animate-fadeUp">

      {/* -------------------------------- */}
      {/* HEADER */}
      {/* -------------------------------- */}

      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">

        <div>
          <div className="flex items-center gap-2 text-sm font-medium text-cyan-400">
            <BarChart3 size={16} />
            RESPONSE ANALYTICS
          </div>

          <h1 className="mt-1 text-3xl font-bold text-white">
            Response Analytics
          </h1>

          <p className="mt-2 text-slate-400">
            Network performance, emergency demand and
            response capacity insights.
          </p>
        </div>

        {/* RANGE BUTTONS */}

        <div className="flex flex-wrap items-center gap-2">

          <span className="rounded-full border border-slate-700 bg-slate-900 px-3 py-2 text-xs text-slate-400">
            Prototype / Demo Data
          </span>

          {RANGES.map((item) => (
            <button
              key={item}
              onClick={() => setRange(item)}
              className={`rounded-xl px-4 py-2 text-xs font-semibold transition ${
                range === item
                  ? "bg-gradient-to-r from-cyan-500 to-blue-600 text-white"
                  : "border border-slate-700 bg-slate-900 text-slate-400 hover:text-white"
              }`}
            >
              {item}
            </button>
          ))}

        </div>
      </div>

      {/* -------------------------------- */}
      {/* KPI CARDS */}
      {/* -------------------------------- */}

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">

        {/* Emergencies */}

        <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-5">

          <div className="flex items-center justify-between">

            <div>
              <p className="text-sm text-slate-400">
                Total Emergencies
              </p>

              <p className="mt-2 text-3xl font-bold text-white">
                {totalEmergencies}
              </p>
            </div>

            <div className="rounded-xl bg-cyan-500/10 p-3">
              <Activity
                size={22}
                className="text-cyan-400"
              />
            </div>

          </div>
        </div>

        {/* Critical */}

        <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-5">

          <div className="flex items-center justify-between">

            <div>
              <p className="text-sm text-slate-400">
                Critical Cases
              </p>

              <p className="mt-2 text-3xl font-bold text-red-400">
                {criticalEmergencies}
              </p>
            </div>

            <div className="rounded-xl bg-red-500/10 p-3">
              <AlertTriangle
                size={22}
                className="text-red-400"
              />
            </div>

          </div>
        </div>

        {/* Ambulances */}

        <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-5">

          <div className="flex items-center justify-between">

            <div>
              <p className="text-sm text-slate-400">
                Ambulances Available
              </p>

              <p className="mt-2 text-3xl font-bold text-emerald-400">
                {availableAmbulances}
                <span className="ml-1 text-base text-slate-500">
                  / {totalAmbulances}
                </span>
              </p>
            </div>

            <div className="rounded-xl bg-emerald-500/10 p-3">
              <Ambulance
                size={22}
                className="text-emerald-400"
              />
            </div>

          </div>
        </div>

        {/* Escalations */}

        <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-5">

          <div className="flex items-center justify-between">

            <div>
              <p className="text-sm text-slate-400">
                Escalations
              </p>

              <p className="mt-2 text-3xl font-bold text-orange-400">
                {escalations}
              </p>
            </div>

            <div className="rounded-xl bg-orange-500/10 p-3">
              <Clock
                size={22}
                className="text-orange-400"
              />
            </div>

          </div>
        </div>

      </div>

      {/* -------------------------------- */}
      {/* CHART GRID */}
      {/* -------------------------------- */}

      <div className="grid gap-4 lg:grid-cols-2">

        {/* EMERGENCY TYPES */}

        <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-5">

          <h3 className="text-sm font-semibold text-white">
            Emergency Types
          </h3>

          <p className="mt-1 text-xs text-slate-500">
            Distribution of reported incidents
          </p>

          <div className="mt-3 h-64">

            <ResponsiveContainer
              width="100%"
              height="100%"
            >
              <BarChart data={typeData}>

                <CartesianGrid
                  stroke="#1B2B4E"
                  strokeDasharray="3 3"
                />

                <XAxis
                  dataKey="name"
                  tick={{
                    fill: "#94A3B8",
                    fontSize: 10,
                  }}
                />

                <YAxis
                  allowDecimals={false}
                  tick={{
                    fill: "#64748B",
                    fontSize: 10,
                  }}
                />

                <Tooltip
                  contentStyle={{
                    background: "#0C1730",
                    border: "1px solid #1B2B4E",
                    borderRadius: 12,
                    fontSize: 12,
                  }}
                />

                <Bar
                  dataKey="value"
                  name="Incidents"
                  radius={[6, 6, 0, 0]}
                >
                  {typeData.map((_, index) => (
                    <Cell
                      key={index}
                      fill={
                        COLORS[
                          index % COLORS.length
                        ]
                      }
                    />
                  ))}
                </Bar>

              </BarChart>
            </ResponsiveContainer>

          </div>
        </div>

        {/* SEVERITY */}

        <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-5">

          <h3 className="text-sm font-semibold text-white">
            Severity Distribution
          </h3>

          <p className="mt-1 text-xs text-slate-500">
            Emergency priority breakdown
          </p>

          <div className="mt-3 h-64">

            <ResponsiveContainer
              width="100%"
              height="100%"
            >
              <PieChart>

                <Pie
                  data={severityData}
                  dataKey="value"
                  nameKey="name"
                  innerRadius={55}
                  outerRadius={85}
                  paddingAngle={3}
                >
                  {severityData.map((item) => (
                    <Cell
                      key={item.name}
                      fill={
                        SEVERITY_COLORS[
                          item.name
                        ] || "#64748B"
                      }
                    />
                  ))}
                </Pie>

                <Tooltip
                  contentStyle={{
                    background: "#0C1730",
                    border: "1px solid #1B2B4E",
                    borderRadius: 12,
                    fontSize: 12,
                  }}
                />

                <Legend
                  iconSize={10}
                  wrapperStyle={{
                    fontSize: 11,
                  }}
                />

              </PieChart>
            </ResponsiveContainer>

          </div>
        </div>

        {/* RESPONSE TIME */}

        <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-5">

          <h3 className="text-sm font-semibold text-white">
            Average Response Time
          </h3>

          <p className="mt-1 text-xs text-slate-500">
            Average response time in minutes
          </p>

          <div className="mt-3 h-64">

            <ResponsiveContainer
              width="100%"
              height="100%"
            >
              <LineChart data={responseData}>

                <CartesianGrid
                  stroke="#1B2B4E"
                  strokeDasharray="3 3"
                />

                <XAxis
                  dataKey="h"
                  tick={{
                    fill: "#94A3B8",
                    fontSize: 10,
                  }}
                />

                <YAxis
                  domain={[6, 12]}
                  tick={{
                    fill: "#64748B",
                    fontSize: 10,
                  }}
                />

                <Tooltip
                  contentStyle={{
                    background: "#0C1730",
                    border: "1px solid #1B2B4E",
                    borderRadius: 12,
                    fontSize: 12,
                  }}
                />

                <Line
                  type="monotone"
                  dataKey="min"
                  name="Avg minutes"
                  stroke="#22D3EE"
                  strokeWidth={3}
                  dot={{
                    r: 4,
                    fill: "#22D3EE",
                  }}
                />

              </LineChart>
            </ResponsiveContainer>

          </div>
        </div>

        {/* AMBULANCE AVAILABILITY */}

        <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-5">

          <h3 className="text-sm font-semibold text-white">
            Ambulance Availability
          </h3>

          <p className="mt-1 text-xs text-slate-500">
            Available units across the day
          </p>

          <div className="mt-3 h-64">

            <ResponsiveContainer
              width="100%"
              height="100%"
            >
              <LineChart data={ambulanceData}>

                <CartesianGrid
                  stroke="#1B2B4E"
                  strokeDasharray="3 3"
                />

                <XAxis
                  dataKey="h"
                  tick={{
                    fill: "#94A3B8",
                    fontSize: 10,
                  }}
                />

                <YAxis
                  allowDecimals={false}
                  tick={{
                    fill: "#64748B",
                    fontSize: 10,
                  }}
                />

                <Tooltip
                  contentStyle={{
                    background: "#0C1730",
                    border: "1px solid #1B2B4E",
                    borderRadius: 12,
                    fontSize: 12,
                  }}
                />

                <Line
                  type="monotone"
                  dataKey="avail"
                  name="Units available"
                  stroke="#22C55E"
                  strokeWidth={3}
                  dot={{
                    r: 4,
                    fill: "#22C55E",
                  }}
                />

              </LineChart>
            </ResponsiveContainer>

          </div>
        </div>

      </div>

      {/* -------------------------------- */}
      {/* HOSPITAL CAPACITY */}
      {/* -------------------------------- */}

      <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-5">

        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">

          <div>
            <h3 className="text-sm font-semibold text-white">
              Hospital Capacity
            </h3>

            <p className="mt-1 text-xs text-slate-500">
              Current estimated hospital occupancy
            </p>
          </div>

          <span className="rounded-full bg-orange-500/10 px-3 py-1 text-xs font-medium text-orange-400">
            {escalations} escalations
          </span>

        </div>

        <div className="mt-3 h-72">

          {hospitalCapacity.length > 0 ? (

            <ResponsiveContainer
              width="100%"
              height="100%"
            >
              <BarChart
                data={hospitalCapacity}
                layout="vertical"
              >

                <CartesianGrid
                  stroke="#1B2B4E"
                  strokeDasharray="3 3"
                />

                <XAxis
                  type="number"
                  domain={[0, 100]}
                  tick={{
                    fill: "#64748B",
                    fontSize: 10,
                  }}
                />

                <YAxis
                  type="category"
                  dataKey="name"
                  width={130}
                  tick={{
                    fill: "#94A3B8",
                    fontSize: 10,
                  }}
                />

                <Tooltip
                  contentStyle={{
                    background: "#0C1730",
                    border: "1px solid #1B2B4E",
                    borderRadius: 12,
                    fontSize: 12,
                  }}
                />

                <Bar
                  dataKey="cap"
                  name="Occupancy %"
                  radius={[0, 6, 6, 0]}
                >
                  {hospitalCapacity.map(
                    (hospital, index) => (
                      <Cell
                        key={index}
                        fill={
                          hospital.cap > 85
                            ? "#EF4444"
                            : hospital.cap > 65
                            ? "#F59E0B"
                            : "#3B82F6"
                        }
                      />
                    )
                  )}
                </Bar>

              </BarChart>
            </ResponsiveContainer>

          ) : (

            <div className="flex h-full items-center justify-center text-sm text-slate-500">
              No hospital data available.
            </div>

          )}

        </div>
      </div>

    </div>
  );
}