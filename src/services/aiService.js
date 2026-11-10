const rules = [
  { type: 'FIRE', words: ['fire', 'smoke', 'burning', 'flame'], department: 'Fire & Rescue', resources: ['Fire suppression', 'Trauma kit'] },
  { type: 'FLOOD', words: ['flood', 'water rising', 'drowning', 'submerged'], department: 'Water Rescue', resources: ['Water rescue', 'Life jackets'] },
  { type: 'ROAD ACCIDENT', words: ['crash', 'collision', 'accident', 'vehicle', 'car', 'trapped'], department: 'Trauma Response', resources: ['Trauma kit', 'Extrication', 'O- blood'] },
  { type: 'MEDICAL EMERGENCY', words: ['chest', 'breathing', 'unconscious', 'stroke', 'heart', 'injured', 'bleeding'], department: 'Emergency Medicine', resources: ['Defibrillator', 'Cardiac kit', 'O+ blood'] }
]

export function analyzeEmergency({ description = '', type = 'OTHER DISASTER' }) {
  const text = description.toLowerCase()
  const match = rules.find((rule) => rule.words.some((word) => text.includes(word)))
  const emergencyType = type !== 'OTHER DISASTER' ? type : match?.type || 'OTHER DISASTER'
  const criticalWords = ['unconscious', 'not breathing', 'trapped', 'drowning', 'explosion', 'severe bleeding']
  const highWords = ['smoke', 'chest', 'collision', 'fire', 'stroke', 'bleeding', 'injured']
  const severity = criticalWords.some((word) => text.includes(word)) ? 'CRITICAL' : highWords.some((word) => text.includes(word)) ? 'HIGH' : 'MEDIUM'
  const selected = match || { department: 'Emergency Coordination', resources: ['First aid kit', 'Assessment team'] }
  return {
    type: emergencyType, severity, summary: `Demo AI detected a ${severity.toLowerCase()} priority ${emergencyType.toLowerCase()} requiring rapid coordination.`,
    department: selected.department, resources: selected.resources, urgency: severity === 'CRITICAL' ? 'Immediate · dispatch within 2 minutes' : severity === 'HIGH' ? 'Priority · dispatch within 8 minutes' : 'Standard · dispatch within 15 minutes', duplicate: false
  }
}

export function matchHospital(analysis, hospitals) {
  return hospitals.map((hospital) => {
    const capability = hospital.capabilities.some((item) => analysis.type.includes(item.toUpperCase()) || analysis.department.includes(item)) ? 18 : 10
    const score = Math.min(99, Math.round(100 - hospital.eta * 1.8 + capability + (hospital.beds * 1.2) + (hospital.ed === 'Open' ? 8 : 0)))
    return { ...hospital, score, reasons: [hospital.ed === 'Open' ? 'Emergency department available' : 'Emergency department busy', `${hospital.beds} beds available`, `Estimated arrival: ${hospital.eta} min`, capability >= 18 ? 'Specialist capability matched' : 'General emergency capability'] }
  }).sort((a, b) => b.score - a.score)[0]
}
