import React from "react";
import {
  Truck,
  Hospital,
  Users,
  AlertTriangle,
  Droplets,
  Info,
  CheckCheck,
  Bell,
} from "lucide-react";
import { useApp } from "../context/AppContext.jsx";

const ICONS = {
  ambulance: Truck,
  hospital: Hospital,
  family: Users,
  alert: AlertTriangle,
  resource: Droplets,
  info: Info,
  system: Bell,
};

const KIND = {
  success:
    "border-green-500/25 text-green-400 bg-green-500/10",
  warning:
    "border-yellow-500/25 text-yellow-400 bg-yellow-500/10",
  critical:
    "border-red-500/25 text-red-400 bg-red-500/10",
  info:
    "border-cyan-500/25 text-cyan-300 bg-cyan-500/10",
};

export default function Notifications() {
  const {
    notifications = [],
    markAllRead,
    markRead,
  } = useApp();

  // Current AppContext uses read: true/false
  const unreadCount = notifications.filter(
    (notification) => !notification.read
  ).length;

  return (
    <div className="mx-auto max-w-4xl space-y-6 animate-fadeUp">

      {/* HEADER */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

        <div>
          <div className="flex items-center gap-2 text-sm font-medium text-cyan-400">
            <Bell size={16} />
            NOTIFICATION CENTER
          </div>

          <h1 className="mt-1 text-3xl font-bold text-white">
            Notifications
          </h1>

          <p className="mt-2 text-slate-400">
            {unreadCount} unread{" "}
            {unreadCount === 1 ? "update" : "updates"} from the
            emergency coordination network.
          </p>
        </div>

        {/* MARK ALL READ */}
        {unreadCount > 0 && (
          <button
            onClick={markAllRead}
            className="flex items-center justify-center gap-2 rounded-xl border border-slate-700 bg-slate-900 px-4 py-2.5 text-xs font-semibold text-slate-300 transition hover:border-cyan-500/40 hover:text-white"
          >
            <CheckCheck size={15} />
            Mark all read
          </button>
        )}

      </div>

      {/* NOTIFICATION LIST */}
      <div className="overflow-hidden rounded-2xl border border-slate-800 bg-slate-900/70">

        {notifications.length === 0 ? (

          /* EMPTY STATE */
          <div className="flex flex-col items-center justify-center px-6 py-16 text-center">

            <div className="rounded-2xl bg-slate-800 p-4">
              <Bell
                size={28}
                className="text-slate-500"
              />
            </div>

            <h2 className="mt-4 text-lg font-semibold text-white">
              No notifications
            </h2>

            <p className="mt-2 max-w-md text-sm text-slate-500">
              Emergency updates, ambulance dispatches,
              hospital responses and resource alerts will
              appear here.
            </p>

          </div>

        ) : (

          notifications.map((notification, index) => {

            const Icon =
              ICONS[notification.icon] || Info;

            const isUnread = !notification.read;

            return (
              <div
                key={notification.id || index}
                onClick={() =>
                  isUnread &&
                  markRead &&
                  markRead(notification.id)
                }
                className={`flex cursor-pointer items-start gap-4 border-b border-slate-800 px-5 py-5 last:border-b-0 transition hover:bg-slate-800/30 ${
                  isUnread
                    ? "bg-cyan-500/[0.03]"
                    : ""
                }`}
              >

                {/* ICON */}
                <span
                  className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border ${
                    KIND[notification.kind] ||
                    KIND.info
                  }`}
                >
                  <Icon size={18} />
                </span>

                {/* CONTENT */}
                <div className="min-w-0 flex-1">

                  <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">

                    <p
                      className={`text-sm ${
                        isUnread
                          ? "font-semibold text-white"
                          : "text-slate-400"
                      }`}
                    >
                      {notification.title ||
                        "Response Network Update"}
                    </p>

                    {isUnread && (
                      <span className="w-fit rounded-full bg-cyan-500/10 px-2 py-0.5 text-[10px] font-semibold text-cyan-400">
                        NEW
                      </span>
                    )}

                  </div>

                  <p
                    className={`mt-1 text-sm leading-relaxed ${
                      isUnread
                        ? "text-slate-300"
                        : "text-slate-500"
                    }`}
                  >
                    {notification.message ||
                      "New update from the response network."}
                  </p>

                  <p className="mt-2 font-mono text-[10px] text-slate-500">
                    {notification.time || "Just now"}
                  </p>

                </div>

                {/* STATUS */}
                <div className="pt-1">

                  {isUnread ? (
                    <span className="block h-2.5 w-2.5 rounded-full bg-cyan-400" />
                  ) : (
                    <span className="rounded-full bg-slate-800 px-2.5 py-1 text-[9px] font-medium text-slate-500">
                      READ
                    </span>
                  )}

                </div>

              </div>
            );
          })
        )}

      </div>

      {/* INFO CARD */}
      <div className="rounded-2xl border border-cyan-500/20 bg-cyan-500/5 p-5">

        <div className="flex gap-3">

          <Info
            size={18}
            className="mt-0.5 shrink-0 text-cyan-400"
          />

          <div>
            <p className="text-sm font-semibold text-white">
              Response network notifications
            </p>

            <p className="mt-1 text-xs leading-relaxed text-slate-400">
              This center receives updates when emergencies
              are reported, ambulances are dispatched,
              hospitals respond, resources are coordinated,
              or the response workflow changes.
            </p>
          </div>

        </div>

      </div>

    </div>
  );
}