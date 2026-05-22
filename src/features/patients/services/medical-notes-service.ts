import { isSupabaseEnabled, createApi } from '@/lib/supabase'
import { generateMedicalNote } from '../data/generate-patients'
import { type MedicalNote } from '../data/schema'

const notesApi = createApi<MedicalNote>('medical_notes')

const mockNotesCache = new Map<string, MedicalNote[]>()

function getMockNotes(patientId: string): MedicalNote[] {
  if (!mockNotesCache.has(patientId)) {
    mockNotesCache.set(
      patientId,
      Array.from({ length: 3 }, (_, i) => generateMedicalNote(patientId, i + 1))
    )
  }
  return mockNotesCache.get(patientId)!
}

export async function getMedicalNotesByPatientId(patientId: string): Promise<MedicalNote[]> {
  if (!isSupabaseEnabled()) return getMockNotes(patientId)
  const { data, error } = await notesApi.getAll({ orderBy: 'created_at', ascending: false })
  if (error) throw error
  return data.filter((n) => n.patientId === patientId)
}

export async function createMedicalNote(note: Partial<MedicalNote>): Promise<MedicalNote> {
  if (!isSupabaseEnabled()) {
    const newNote: MedicalNote = {
      id: crypto.randomUUID(),
      patientId: '',
      title: '',
      content: '',
      type: 'general',
      createdBy: '',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      ...note,
    } as MedicalNote
    return newNote
  }
  const { data, error } = await notesApi.create({ ...note, id: crypto.randomUUID() } as Partial<MedicalNote>)
  if (error) throw error
  return data
}
