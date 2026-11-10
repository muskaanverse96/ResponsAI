import React, { useMemo } from "react";
import {
  Droplets,
  MapPin,
  Clock,
  Navigation,
  Star,
  Hospital,
  AlertCircle,
} from "lucide-react";
import { useApp } from "../context/AppContext.jsx";

export default function Resources() {
  const { emergencies, hospitals, resources, notify } = useApp();

  // Latest emergency
  const activeEmergency = emergencies?.[0];

  // Required blood group based on emergency severity
  const requiredBlood =
    activeEmergency?.severity === "Critical" ? "O-" : "O+";

  // Make sure resources is an array
  const resourceList = Array.isArray(resources) ? resources : [];

  // Find the best matching blood/resource center
  const recommendedCenter = useMemo(() => {
    const centers = resourceList.filter(
      (item) =>
        item.type === "blood" ||
        item.category === "blood" ||
        item.stock ||
        item.blood
    );

    if (centers.length === 0) {
      return null;
    }

    return centers
      .map((center) => {
        const travelTime =
          Number(center.eta) ||
          Number(center.travelTime) ||
          Number(center.time) ||
          10;

        let available = true;

        if (center.stock?.[requiredBlood] !== undefined) {
          available = center.stock[requiredBlood] > 0;
        }

        if (center.blood?.[requiredBlood] !== undefined) {
          available = center.blood[requiredBlood] > 0;
        }

        return {
          ...center,
          travelTime,
          available,
        };
      })
      .filter((center) => center.available)
      .sort((a, b) => a.travelTime - b.travelTime)[0];
  }, [resourceList, requiredBlood]);

  // Get blood quantity safely
  const getBloodCount = (item, group) => {
    if (item?.stock?.[group] !== undefined) {
      return item.stock[group];
    }

    if (item?.blood?.[group] !== undefined) {
      return item.blood[group];
    }

    return 0;
  };

  // Notify resource team
  const handleDispatch = () => {
    if (!recommendedCenter) {
      notify(
        "No blood center available",
        `No suitable ${requiredBlood} blood resource was found.`,
        "warning"
      );
      return;
    }

    notify(
      "Resource team notified",
      `${
        recommendedCenter.name || "Blood center"
      } has been notified for ${requiredBlood} blood.`,
      "critical"
    );
  };

  return (
    <div className="space-y-6">
      {/* PAGE HEADER */}
      <div>
        <div className="text-sm font-medium text-cyan-400">
          RESOURCE COORDINATION
        </div>

        <h1 className="mt-1 text-3xl font-bold text-white">
          Blood & Emergency Resources
        </h1>

        <p className="mt-2 text-slate-400">
          Find and coordinate critical resources for active emergencies.
        </p>
      </div>

      {/* ACTIVE EMERGENCY */}
      {activeEmergency && (
        <div className="rounded-2xl border border-red-500/20 bg-red-500/5 p-5">
          <div className="flex items-start gap-3">
            <AlertCircle
              className="mt-1 text-red-400"
              size={22}
            />

            <div>
              <p className="text-sm text-slate-400">
                Active emergency
              </p>

              <h2 className="mt-1 font-semibold text-white">
                {activeEmergency.id}
              </h2>

              <p className="mt-1 text-sm text-slate-400">
                Severity:{" "}
                <span className="font-semibold text-red-400">
                  {activeEmergency.severity || "High"}
                </span>
              </p>
            </div>
          </div>
        </div>
      )}

      {/* SUMMARY CARDS */}
      <div className="grid gap-4 md:grid-cols-3">
        {/* Blood */}
        <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-5">
          <div className="flex items-center gap-3">
            <div className="rounded-xl bg-red-500/10 p-3">
              <Droplets
                className="text-red-400"
                size={22}
              />
            </div>

            <div>
              <p className="text-sm text-slate-400">
                Required Blood
              </p>

              <p className="text-2xl font-bold text-white">
                {requiredBlood}
              </p>
            </div>
          </div>
        </div>

        {/* Hospitals */}
        <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-5">
          <div className="flex items-center gap-3">
            <div className="rounded-xl bg-cyan-500/10 p-3">
              <Hospital
                className="text-cyan-400"
                size={22}
              />
            </div>

            <div>
              <p className="text-sm text-slate-400">
                Hospitals
              </p>

              <p className="text-2xl font-bold text-white">
                {hospitals?.length || 0}
              </p>
            </div>
          </div>
        </div>

        {/* Resource Centers */}
        <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-5">
          <div className="flex items-center gap-3">
            <div className="rounded-xl bg-emerald-500/10 p-3">
              <Navigation
                className="text-emerald-400"
                size={22}
              />
            </div>

            <div>
              <p className="text-sm text-slate-400">
                Resource Centers
              </p>

              <p className="text-2xl font-bold text-white">
                {resourceList.length}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* AI RECOMMENDATION */}
      {recommendedCenter ? (
        <div className="rounded-2xl border border-cyan-500/30 bg-slate-900 p-6">
          <div className="mb-5 flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-cyan-400">
                AI Recommended
              </p>

              <h2 className="mt-1 text-xl font-bold text-white">
                Best Resource Match
              </h2>
            </div>

            <Star
              className="text-yellow-400"
              size={24}
            />
          </div>

          <div className="grid gap-5 md:grid-cols-2">
            {/* Center information */}
            <div>
              <h3 className="text-lg font-semibold text-white">
                {recommendedCenter.name ||
                  "Blood Resource Center"}
              </h3>

              <div className="mt-3 space-y-2 text-sm text-slate-400">
                {/* Location */}
                <div className="flex items-center gap-2">
                  <MapPin size={16} />

                  {recommendedCenter.location ||
                    recommendedCenter.address ||
                    "Location available"}
                </div>

                {/* Travel time */}
                <div className="flex items-center gap-2">
                  <Clock size={16} />

                  Approx.{" "}
                  {recommendedCenter.travelTime} min away
                </div>

                {/* Blood */}
                <div className="flex items-center gap-2">
                  <Droplets size={16} />

                  {requiredBlood} blood available
                </div>
              </div>
            </div>

            {/* Action */}
            <div className="flex items-center justify-start md:justify-end">
              <button
                onClick={handleDispatch}
                className="rounded-xl bg-cyan-500 px-5 py-3 font-semibold text-slate-950 transition hover:bg-cyan-400"
              >
                Notify Resource Team
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-6">
          <div className="flex items-center gap-3">
            <AlertCircle
              className="text-yellow-400"
              size={22}
            />

            <div>
              <h2 className="font-semibold text-white">
                No dedicated blood center found
              </h2>

              <p className="mt-1 text-sm text-slate-400">
                The current demo data does not contain a
                matching blood center.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* AVAILABLE RESOURCES */}
      <section>
        <h2 className="mb-4 text-xl font-bold text-white">
          Available Resources
        </h2>

        {resourceList.length === 0 ? (
          <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-6 text-slate-400">
            No resource records are available in the
            current demo data.
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {resourceList.map((item, index) => (
              <div
                key={item.id || index}
                className="rounded-2xl border border-slate-800 bg-slate-900/70 p-5"
              >
                {/* Icon + status */}
                <div className="flex items-start justify-between">
                  <div className="rounded-xl bg-red-500/10 p-3">
                    <Droplets
                      className="text-red-400"
                      size={20}
                    />
                  </div>

                  <span className="rounded-full bg-emerald-500/10 px-3 py-1 text-xs font-medium text-emerald-400">
                    Available
                  </span>
                </div>

                {/* Name */}
                <h3 className="mt-4 font-semibold text-white">
                  {item.name ||
                    `Resource Center ${index + 1}`}
                </h3>

                {/* Location */}
                <p className="mt-1 flex items-center gap-2 text-sm text-slate-400">
                  <MapPin size={14} />

                  {item.location ||
                    item.address ||
                    "Response network location"}
                </p>

                {/* Blood stock */}
                <div className="mt-4 grid grid-cols-2 gap-2">
                  {/* O+ */}
                  <div className="rounded-xl bg-slate-800/70 p-3">
                    <p className="text-xs text-slate-500">
                      O+
                    </p>

                    <p className="mt-1 font-semibold text-white">
                      {getBloodCount(item, "O+")}
                    </p>
                  </div>

                  {/* O- */}
                  <div className="rounded-xl bg-slate-800/70 p-3">
                    <p className="text-xs text-slate-500">
                      O-
                    </p>

                    <p className="mt-1 font-semibold text-white">
                      {getBloodCount(item, "O-")}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* HOSPITAL BLOOD BANKS */}
      <section>
        <h2 className="mb-4 text-xl font-bold text-white">
          Hospital Blood Banks
        </h2>

        <div className="overflow-hidden rounded-2xl border border-slate-800 bg-slate-900/70">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="border-b border-slate-800 bg-slate-950/60">
                <tr>
                  <th className="px-5 py-4 text-sm font-semibold text-slate-300">
                    Hospital
                  </th>

                  <th className="px-5 py-4 text-sm font-semibold text-slate-300">
                    O+
                  </th>

                  <th className="px-5 py-4 text-sm font-semibold text-slate-300">
                    O-
                  </th>

                  <th className="px-5 py-4 text-sm font-semibold text-slate-300">
                    Status
                  </th>
                </tr>
              </thead>

              <tbody>
                {(hospitals || []).map(
                  (hospital, index) => (
                    <tr
                      key={hospital.id || index}
                      className="border-b border-slate-800 last:border-b-0"
                    >
                      {/* Hospital */}
                      <td className="px-5 py-4">
                        <p className="font-medium text-white">
                          {hospital.name ||
                            `Hospital ${index + 1}`}
                        </p>

                        <p className="mt-1 text-xs text-slate-500">
                          {hospital.location ||
                            hospital.address ||
                            "Response network"}
                        </p>
                      </td>

                      {/* O+ */}
                      <td className="px-5 py-4 font-medium text-white">
                        {getBloodCount(hospital, "O+")}
                      </td>

                      {/* O- */}
                      <td className="px-5 py-4 font-medium text-white">
                        {getBloodCount(hospital, "O-")}
                      </td>

                      {/* Status */}
                      <td className="px-5 py-4">
                        <span className="rounded-full bg-emerald-500/10 px-3 py-1 text-xs font-medium text-emerald-400">
                          Operational
                        </span>
                      </td>
                    </tr>
                  )
                )}

                {(!hospitals ||
                  hospitals.length === 0) && (
                  <tr>
                    <td
                      colSpan="4"
                      className="px-5 py-8 text-center text-slate-500"
                    >
                      No hospitals available.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </section>
    </div>
  );
}