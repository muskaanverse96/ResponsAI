import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { ambulances as seedAmbulances, hospitals as seedHospitals, resources as seedResources, seedEmergencies } from '../data/mockData'
import { analyzeEmergency, matchHospital } from '../services/aiService'

const AppContext = createContext(null)
const initialNotifications = [{ id: 1, title: 'Response network online', message: 'All local demo services are ready.', time: 'Just now', read: false, kind: 'system' }]

export function AppProvider({ children }) {
  const [emergencies, setEmergencies] = useState(() => JSON.parse(localStorage.getItem('responsai-emergencies') || 'null') || seedEmergencies)
  const [ambulances, setAmbulances] = useState(() => JSON.parse(localStorage.getItem('responsai-ambulances') || 'null') || seedAmbulances)
  const [hospitals] = useState(seedHospitals)
  const [notifications, setNotifications] = useState(() => JSON.parse(localStorage.getItem('responsai-notifications') || 'null') || initialNotifications)
  const [user, setUser] = useState(() => JSON.parse(localStorage.getItem('responsai-user') || 'null'))
  const resources = seedResources

  useEffect(() => { localStorage.setItem('responsai-emergencies', JSON.stringify(emergencies)); localStorage.setItem('responsai-ambulances', JSON.stringify(ambulances)); localStorage.setItem('responsai-notifications', JSON.stringify(notifications)); localStorage.setItem('responsai-user', JSON.stringify(user)) }, [emergencies, ambulances, notifications, user])
  const notify = (title, message, kind = 'info') => setNotifications((current) => [{ id: Date.now(), title, message, time: 'Just now', read: false, kind }, ...current])
  const createEmergency = (payload) => {
    const analysis = analyzeEmergency(payload)
    const hospital = matchHospital(analysis, hospitals)
    const ambulance = ambulances.find((item) => item.status === 'AVAILABLE')
    const emergency = { id: `RS-${String(Date.now()).slice(-5)}`, ...payload, type: analysis.type, severity: analysis.severity, summary: analysis.summary, status: 'AI analysis complete', hospitalId: hospital.id, ambulanceId: ambulance?.id || null, createdAt: Date.now(), timeline: ['Emergency reported', 'AI analyzed'] }
    setEmergencies((current) => [emergency, ...current])
    if (ambulance) setAmbulances((current) => current.map((item) => item.id === ambulance.id ? { ...item, status: 'DISPATCHED', emergencyId: emergency.id, eta: hospital.eta } : item))
    notify('Emergency created', `${emergency.id} classified as ${analysis.severity}.`, 'critical')
    return { emergency, analysis, hospital, ambulance }
  }
  const updateEmergency = (id, changes, notification) => { setEmergencies((current) => current.map((item) => item.id === id ? { ...item, ...changes } : item)); if (notification) notify(notification.title, notification.message, notification.kind) }
  const dispatch = (id) => { const emergency = emergencies.find((item) => item.id === id); const ambulance = ambulances.find((item) => item.id === emergency?.ambulanceId) || ambulances.find((item) => item.status === 'AVAILABLE'); if (!emergency || !ambulance) return; setAmbulances((current) => current.map((item) => item.id === ambulance.id ? { ...item, status: 'EN ROUTE', emergencyId: id } : item)); updateEmergency(id, { ambulanceId: ambulance.id, status: 'Ambulance en route', timeline: [...(emergency.timeline || []), 'Ambulance dispatched', 'Ambulance en route'] }, { title: 'Ambulance dispatched', message: `${ambulance.id} is en route to ${emergency.location}.`, kind: 'critical' }) }
  const advanceEmergency = (id, step) => { const emergency = emergencies.find((item) => item.id === id); const states = { arrived: ['AT SCENE', 'At scene', 'Arrived at scene'], transport: ['TRANSPORTING', 'Patient in transport', 'Patient transported'], hospital: ['AT SCENE', 'At hospital', 'Arrived at hospital'], handover: ['AVAILABLE', 'Resolved', 'Handover completed'] }; const next = states[step]; if (!emergency || !next) return; if (emergency.ambulanceId) setAmbulances((current) => current.map((item) => item.id === emergency.ambulanceId ? { ...item, status: next[0] } : item)); updateEmergency(id, { status: next[1], timeline: [...(emergency.timeline || []), next[2]] }, { title: step === 'handover' ? 'Handover completed' : next[2], message: `${emergency.id} updated in the response workflow.` }) }
  const acceptHospital = (id) => { const emergency = emergencies.find((item) => item.id === id); updateEmergency(id, { status: 'Hospital accepted', timeline: [...(emergency.timeline || []), 'Hospital accepted'] }, { title: 'Hospital accepted', message: `${emergency.hospitalId ? hospitals.find((h) => h.id === emergency.hospitalId)?.name : 'Hospital'} is preparing.` }) }
  const resetDemo = () => { setEmergencies(seedEmergencies); setAmbulances(seedAmbulances); setNotifications(initialNotifications); notify('Demo reset', 'Sample response data has been restored.') }
  const value = useMemo(() => ({ emergencies, ambulances, hospitals, resources, notifications, user, setUser, createEmergency, updateEmergency, dispatch, advanceEmergency, acceptHospital, resetDemo, notify, unread: notifications.filter((item) => !item.read).length, markRead: (id) => setNotifications((current) => current.map((item) => item.id === id ? { ...item, read: true } : item)), markAllRead: () => setNotifications((current) => current.map((item) => ({ ...item, read: true }))) }), [emergencies, ambulances, hospitals, resources, notifications, user])
  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}
export const useApp = () => useContext(AppContext)
