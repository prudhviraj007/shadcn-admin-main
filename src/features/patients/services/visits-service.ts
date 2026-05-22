import { isSupabaseEnabled, createApi } from '@/lib/supabase'
import { generateVisit } from '../data/generate-patients'
import { type Visit } from '../data/schema'

const visitsApi = createApi<Visit>('visits')

const mockVisitsCache = new Map<string, Visit[]>()

function getMockVisits(patientId: string): Visit[] {
  if (!mockVisitsCache.has(patientId)) {
    mockVisitsCache.set(
      patientId,
      Array.from({ length: 4 }, (_, i) => generateVisit(patientId, i + 50))
    )
  }
  return mockVisitsCache.get(patientId)!
}

export async function getVisitsByPatientId(patientId: string): Promise<Visit[]> {
  if (!isSupabaseEnabled()) return getMockVisits(patientId)
  const { data, error } = await visitsApi.getAll({ orderBy: 'date', ascending: false })
  if (error) throw error
  return data.filter((v) => v.patientId === patientId)
}

export async function createVisit(visit: Partial<Visit>): Promise<Visit> {
  if (!isSupabaseEnabled()) {
    const newVisit: Visit = {
      id: crypto.randomUUID(),
      patientId: '',
      date: '',
      type: '',
      doctor: '',
      department: '',
      reason: '',
      diagnosis: '',
      notes: '',
      status: 'completed',
      ...visit,
    } as Visit
    return newVisit
  }
  const { data, error } = await visitsApi.create({ ...visit, id: crypto.randomUUID() } as Partial<Visit>)
  if (error) throw error
  return data
}
