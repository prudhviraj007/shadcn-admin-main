import { generatePatients, generateMedicalNotes, generateVisits } from '@/mock/patient'
import { generateDoctors } from '@/mock/doctor'
import { generateAppointments } from '@/mock/appointment'
import { generateConversations } from '@/mock/conversation'
import { generateNotifications } from '@/mock/notification'

function getConfig() {
  const baseUrl = import.meta.env.VITE_SUPABASE_URL
  const apiKey = import.meta.env.VITE_SUPABASE_ANON_KEY
  if (!baseUrl || !apiKey) return null
  return { baseUrl, apiKey }
}

async function upsertTable(table: string, data: Record<string, unknown>[]) {
  const cfg = getConfig()
  if (!cfg) {
    console.warn('[Seed] Supabase not configured, skipping seed')
    return
  }

  if (data.length === 0) return

  const url = `${cfg.baseUrl}/rest/v1/${table}?on_conflict=id`

  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: {
        apikey: cfg.apiKey,
        Authorization: `Bearer ${cfg.apiKey}`,
        'Content-Type': 'application/json',
        Prefer: 'resolution=merge-duplicates, return=minimal',
      },
      body: JSON.stringify(data),
    })

    if (!res.ok) {
      const text = await res.text()
      console.error(`[Seed] Failed to seed ${table}: ${res.status} ${text}`)
    } else {
      console.log(`[Seed] Seeded ${table} with ${data.length} rows`)
    }
  } catch (e) {
    console.error(`[Seed] Error seeding ${table}:`, e)
  }
}

export async function seedDatabase() {
  console.log('[Seed] Starting database seed...')

  const patients = generatePatients(50, 100)
  const doctors = generateDoctors(15, 200)
  const appointments = generateAppointments(100, 300)
  const conversations = generateConversations(20, 400)
  const notifications = generateNotifications(30, 500)

  const patientIds = patients.map((p) => p.id)
  const medicalNotes = generateMedicalNotes(patientIds)
  const visits = generateVisits(patientIds)

  const tables: { name: string; data: Record<string, unknown>[] }[] = [
    { name: 'patients', data: patients as unknown[] as Record<string, unknown>[] },
    { name: 'doctors', data: doctors as unknown[] as Record<string, unknown>[] },
    { name: 'appointments', data: appointments as unknown[] as Record<string, unknown>[] },
    { name: 'conversations', data: conversations as unknown[] as Record<string, unknown>[] },
    { name: 'medical_notes', data: medicalNotes as unknown[] as Record<string, unknown>[] },
    { name: 'visits', data: visits as unknown[] as Record<string, unknown>[] },
    { name: 'notifications', data: notifications as unknown[] as Record<string, unknown>[] },
  ]

  for (const { name, data } of tables) {
    if (data.length === 0) continue
    await upsertTable(name, data)
  }

  console.log('[Seed] Database seed complete')
}
