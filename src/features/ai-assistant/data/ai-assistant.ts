import { type ChatSession, type UrgentSymptom, type AiSuggestion, type AiActivity, type QuickAction, type AiSummary, type AiMetric } from '../types'

export const metrics: AiMetric[] = [
  { title: 'Active Sessions', value: '12', change: '+3 in last hour', changeType: 'positive', iconName: 'BotMessageSquare' },
  { title: 'Urgent Flags', value: '5', change: '+2 new today', changeType: 'negative', iconName: 'AlertTriangle' },
  { title: 'Suggestions Today', value: '84', change: '+12.4% vs yesterday', changeType: 'positive', iconName: 'Lightbulb' },
  { title: 'Avg Response Time', value: '2.4m', change: '-18s vs last week', changeType: 'positive', iconName: 'Timer' },
]

export const chatSessions: ChatSession[] = [
  {
    id: 'session-1',
    patient: 'Olivia Martin',
    avatar: '/avatars/01.png',
    subtitle: 'Hypertension follow-up',
    messages: [
      { id: 'm1', author: 'patient', text: 'I started the new blood pressure medicine yesterday. Can I take it with breakfast?', time: '9:31 AM' },
      { id: 'm2', author: 'ai', text: 'Based on the medication profile, taking with food may help reduce GI discomfort. However, given the reported lightheadedness, I recommend holding the dose and consulting Dr. Rao before proceeding.', time: '9:33 AM' },
      { id: 'm3', author: 'staff', text: 'Thanks AI. Olivia — please hold off until Dr. Rao reviews your latest BP log. We will follow up within 2 hours.', time: '9:36 AM' },
    ],
  },
]

export const urgentSymptoms: UrgentSymptom[] = [
  {
    id: 'sym-1',
    symptom: 'Chest tightness & SOB',
    patient: 'James Wilson',
    description: 'Reported sudden chest tightness with shortness of breath starting 30 mins ago. History of CAD.',
    detectedAt: '2 mins ago',
    urgency: 'critical',
    suggestedAction: 'Immediate triage — dispatch EMS. Flag to attending cardiologist.',
  },
  {
    id: 'sym-2',
    symptom: 'Severe headache + vision changes',
    patient: 'Maria Garcia',
    description: 'Patient reports worst headache ever with blurred vision. BP 198/112 mmHg at home reading.',
    detectedAt: '8 mins ago',
    urgency: 'critical',
    suggestedAction: 'Possible hypertensive crisis. Advise ED evaluation. Notify Dr. Kim stat.',
  },
  {
    id: 'sym-3',
    symptom: 'Post-op wound redness',
    patient: 'Robert Chen',
    description: 'Knee replacement site warm to touch with advancing erythema. Pain 7/10.',
    detectedAt: '18 mins ago',
    urgency: 'moderate',
    suggestedAction: 'Schedule same-day wound check. Consider starting empiric antibiotics.',
  },
  {
    id: 'sym-4',
    symptom: 'Unexplained weight gain',
    patient: 'Sarah Ahmed',
    description: 'Gained 2.1 kg in 3 days. Reports worsening ankle edema and fatigue.',
    detectedAt: '35 mins ago',
    urgency: 'moderate',
    suggestedAction: 'Rule out heart failure exacerbation. Order BNP and CXR. Review diuretic adherence.',
  },
  {
    id: 'sym-5',
    symptom: 'New medication rash',
    patient: 'Emily Park',
    description: 'Diffuse maculopapular rash started 2 days after starting amoxicillin. Mild pruritus, no mucosal involvement.',
    detectedAt: '1h ago',
    urgency: 'monitor',
    suggestedAction: 'Likely drug eruption. Consider antihistamine. Switch antibiotic class. Monitor for progression.',
  },
]

export const aiSuggestions: AiSuggestion[] = [
  {
    id: 'sug-1',
    context: 'Olivia Martin — BP medication question',
    reply: 'Taking the medication with food is generally fine, but given your lightheadedness, please hold off and wait for Dr. Rao to review. We will follow up shortly.',
    category: 'medication',
    confidence: 94,
  },
  {
    id: 'sug-2',
    context: 'James Wilson — chest tightness',
    reply: 'If chest tightness persists or worsens, please call 911 immediately. I have flagged this to your care team for urgent review. An AI assistant is not a substitute for emergency care.',
    category: 'symptom',
    confidence: 97,
  },
  {
    id: 'sug-3',
    context: 'Maria Garcia — headache & vision changes',
    reply: 'Your BP reading of 198/112 is critically elevated. Please proceed to the nearest Emergency Department now. I have notified Dr. Kim of your results.',
    category: 'symptom',
    confidence: 96,
  },
  {
    id: 'sug-4',
    context: 'Robert Chen — wound concerns',
    reply: 'Warmth and advancing redness around a surgical site needs same-day evaluation. We have scheduled a wound check at 2 PM. Please avoid putting pressure on the knee until seen.',
    category: 'follow-up',
    confidence: 91,
  },
  {
    id: 'sug-5',
    context: 'General — appointment reminder',
    reply: 'This is a reminder of your upcoming appointment with Dr. Shah on Friday at 2:00 PM. Please bring your current medication list and any recent lab results.',
    category: 'scheduling',
    confidence: 99,
  },
]

export const aiActivities: AiActivity[] = [
  { id: 'act-1', type: 'alert', title: 'Urgent symptom detected', description: 'Chest tightness pattern matched critical cardiac protocol in James Wilson\'s message.', patient: 'James Wilson', timestamp: '2m ago' },
  { id: 'act-2', type: 'draft', title: 'AI draft completed', description: 'Drafted reply for Maria Garcia\'s hypertensive crisis — ready for staff review and approval.', patient: 'Maria Garcia', timestamp: '7m ago' },
  { id: 'act-3', type: 'summary', title: 'AI summary generated', description: 'Overnight summary covering 8 patient interactions — 2 medication questions, 3 symptom reports, 3 scheduling requests.', patient: 'System', timestamp: '45m ago' },
  { id: 'act-4', type: 'suggestion', title: 'Reply suggestion accepted', description: 'Staff accepted AI-generated reply for Olivia Martin\'s BP medication question with minor edits.', patient: 'Olivia Martin', timestamp: '1h ago' },
  { id: 'act-5', type: 'review', title: 'Staff reviewed AI draft', description: 'Dr. Rao reviewed and approved AI-drafted lab follow-up for Jackson Lee. Sent to patient.', patient: 'Jackson Lee', timestamp: '2h ago' },
  { id: 'act-6', type: 'alert', title: 'Medication interaction flagged', description: 'AI detected potential interaction between new prescription and existing statin for Sarah Ahmed.', patient: 'Sarah Ahmed', timestamp: '3h ago' },
]

export const quickActions: QuickAction[] = [
  { id: 'qa-1', title: 'Generate Summary', description: 'AI-powered patient visit summary', iconName: 'FileText', color: 'text-violet-600 dark:text-violet-400' },
  { id: 'qa-2', title: 'Triage Assistant', description: 'Urgency assessment & routing', iconName: 'HeartPulse', color: 'text-rose-600 dark:text-rose-400' },
  { id: 'qa-3', title: 'Medication Check', description: 'AI drug interaction analysis', iconName: 'Pill', color: 'text-emerald-600 dark:text-emerald-400' },
  { id: 'qa-4', title: 'Schedule Optimizer', description: 'Smart appointment suggestions', iconName: 'Calendar', color: 'text-blue-600 dark:text-blue-400' },
]

export const aiSummaries: AiSummary[] = [
  {
    id: 'sum-1',
    patient: 'Olivia Martin',
    periodStart: 'May 19',
    periodEnd: 'May 20',
    keyPoints: [
      'Started lisinopril 10mg for hypertension on May 18',
      'Reports lightheadedness before lunch; BP log shows systolic trending 10-15 mmHg lower',
      'Asked about taking medication with food',
      'Staff advised holding next dose pending Dr. Rao review',
    ],
    recommendation: 'Consider dose adjustment to 5mg or switch to bedtime dosing. Follow up in 48 hours.',
    generatedAt: '9:45 AM',
  },
  {
    id: 'sum-2',
    patient: 'Jackson Lee',
    periodStart: 'May 18',
    periodEnd: 'May 20',
    keyPoints: [
      'Cholesterol panel results received — LDL 168 mg/dL, HDL 38 mg/dL',
      'Patient inquired about results via portal',
      'Dr. Kim reviewing results — statin dose adjustment possible',
      'AI drafted lab follow-up message; pending physician sign-off',
    ],
    recommendation: 'Schedule follow-up lipid panel in 6 weeks. Consider adding ezetimibe if LDL remains above 160.',
    generatedAt: '9:18 AM',
  },
]
