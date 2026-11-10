export const hospitals = [
  { id: 'h1', name: 'Mercy General', location: 'Downtown · 2.4 km', beds: 6, capacity: 82, ed: 'Open', capabilities: ['Trauma', 'Cardiac', 'Burns'], resources: ['O-', 'Ventilator', 'OR'], eta: 8 },
  { id: 'h2', name: 'St. Catherine Medical', location: 'Northside · 4.1 km', beds: 12, capacity: 64, ed: 'Open', capabilities: ['Trauma', 'Pediatrics'], resources: ['O+', 'ICU'], eta: 12 },
  { id: 'h3', name: 'Riverside University', location: 'East bank · 6.8 km', beds: 3, capacity: 91, ed: 'Busy', capabilities: ['Cardiac', 'Neuro'], resources: ['AB+', 'Cath lab'], eta: 17 }
]

export const ambulances = [
  { id: 'AMB-104', driver: 'Jordan Lee', location: '5th & Pine', status: 'AVAILABLE', eta: 6, distance: '1.8 km', equipment: ['Trauma kit', 'O-', 'Defibrillator'] },
  { id: 'AMB-207', driver: 'Maya Patel', location: 'West District', status: 'EN ROUTE', eta: 4, distance: '1.2 km', equipment: ['Cardiac kit', 'O+', 'Ventilator'] },
  { id: 'AMB-319', driver: 'Sam Okafor', location: 'Central Station', status: 'AVAILABLE', eta: 11, distance: '4.6 km', equipment: ['Burn kit', 'O-', 'Defibrillator'] },
  { id: 'AMB-422', driver: 'Alex Chen', location: 'Riverside', status: 'UNAVAILABLE', eta: 0, distance: '-', equipment: ['Trauma kit', 'AB+', 'Ventilator'] }
]

export const resources = [
  { type: 'O-', quantity: 18, unit: 'units', source: 'Mercy General', status: 'Available' },
  { type: 'O+', quantity: 42, unit: 'units', source: 'Central Blood Center', status: 'Available' },
  { type: 'AB+', quantity: 6, unit: 'units', source: 'Riverside University', status: 'Low stock' },
  { type: 'Ventilators', quantity: 4, unit: 'available', source: 'St. Catherine Medical', status: 'Available' },
  { type: 'Trauma kits', quantity: 9, unit: 'kits', source: 'Emergency Depot A', status: 'Available' }
]

export const seedEmergencies = [
  { id: 'RS-24091', type: 'MEDICAL EMERGENCY', description: 'Chest pain and difficulty breathing reported at a transit hub.', location: 'Union Station, Platform 3', time: '2 min ago', severity: 'CRITICAL', status: 'Ambulance en route', hospitalId: 'h1', ambulanceId: 'AMB-207', contact: 'Nadia Brooks · 555-0192', summary: 'Possible cardiac event requiring immediate assessment.', createdAt: Date.now() - 120000, notifiedFamily: true, timeline: ['Emergency reported', 'AI analyzed', 'Ambulance dispatched', 'Ambulance en route'] },
  { id: 'RS-24090', type: 'ROAD ACCIDENT', description: 'Two-car collision, one person trapped in vehicle.', location: 'East Harbor Bridge', time: '18 min ago', severity: 'HIGH', status: 'Hospital notified', hospitalId: 'h2', ambulanceId: 'AMB-104', contact: 'Owen Davis · 555-0148', summary: 'Collision with possible entrapment and trauma risk.', createdAt: Date.now() - 1080000, notifiedFamily: false, timeline: ['Emergency reported', 'AI analyzed', 'Hospital notified'] },
  { id: 'RS-24089', type: 'FIRE', description: 'Smoke visible from a third-floor apartment.', location: '118 Cedar Avenue', time: '41 min ago', severity: 'HIGH', status: 'Resolved', hospitalId: 'h1', ambulanceId: null, contact: 'Building desk · 555-0100', summary: 'Structural fire with potential occupants at risk.', createdAt: Date.now() - 2460000, notifiedFamily: true, timeline: ['Emergency reported', 'AI analyzed', 'Resolved'] }
]

export const chartData = [
  { day: 'Mon', incidents: 12, response: 8 }, { day: 'Tue', incidents: 18, response: 7 }, { day: 'Wed', incidents: 14, response: 9 }, { day: 'Thu', incidents: 23, response: 6 }, { day: 'Fri', incidents: 19, response: 8 }, { day: 'Sat', incidents: 27, response: 5 }, { day: 'Sun', incidents: 21, response: 7 }
]
