import { Routes, Route } from 'react-router-dom'

import Layout, { RequireAuth } from './components/Layout.jsx'

import Landing from './pages/Landing.jsx'
import Login from './pages/Login.jsx'
import Dashboard from './pages/Dashboard.jsx'
import EmergencyReport from './pages/EmergencyReport.jsx'
import Analysis from './pages/Analysis.jsx'
import Emergencies from './pages/Emergencies.jsx'
import Orchestrator from './pages/Orchestrator.jsx'
import Ambulances from './pages/Ambulances.jsx'
import Driver from './pages/Driver.jsx'
import Hospitals from './pages/Hospitals.jsx'
import HospitalPanel from './pages/HospitalPanel.jsx'
import Tracking from './pages/Tracking.jsx'
import Resources from './pages/Resources.jsx'
import Analytics from './pages/Analytics.jsx'
import Notifications from './pages/Notifications.jsx'
import Settings from './pages/Settings.jsx'
import Admin from './pages/Admin.jsx'
import CallBot from './pages/CallBot.jsx'
import NotFound from './pages/NotFound.jsx'

export default function App() {
  return (
    <Routes>

      {/* Public pages */}
      <Route
        path="/"
        element={<Landing />}
      />

      <Route
        path="/login"
        element={<Login />}
      />

      {/* Protected application */}
      <Route
        element={
          <RequireAuth>
            <Layout />
          </RequireAuth>
        }
      >

        <Route
          path="/dashboard"
          element={<Dashboard />}
        />

        <Route
          path="/report"
          element={<EmergencyReport />}
        />

        <Route
          path="/analysis/:id"
          element={<Analysis />}
        />

        <Route
          path="/emergencies"
          element={<Emergencies />}
        />

        <Route
          path="/orchestrator"
          element={<Orchestrator />}
        />

        <Route
          path="/ambulances"
          element={<Ambulances />}
        />

        <Route
          path="/driver"
          element={<Driver />}
        />

        <Route
          path="/hospitals"
          element={<Hospitals />}
        />

        <Route
          path="/hospital-panel"
          element={<HospitalPanel />}
        />

        <Route
          path="/tracking"
          element={<Tracking />}
        />

        <Route
          path="/resources"
          element={<Resources />}
        />

        <Route
          path="/analytics"
          element={<Analytics />}
        />

        <Route
          path="/notifications"
          element={<Notifications />}
        />

        <Route
          path="/settings"
          element={<Settings />}
        />

        <Route
          path="/admin"
          element={<Admin />}
        />

        {/* Full-page CallBot */}
        <Route
          path="/callbot"
          element={<CallBot />}
        />

      </Route>

      {/* 404 */}
      <Route
        path="*"
        element={<NotFound />}
      />

    </Routes>
  )
}