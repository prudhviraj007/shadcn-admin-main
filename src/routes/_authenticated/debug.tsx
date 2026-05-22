import { useEffect, useState } from 'react'
import { createFileRoute } from '@tanstack/react-router'
import { isSupabaseEnabled } from '@/lib/supabase'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'

type TableStatus = {
  name: string
  ok: boolean
  count: number
  error?: string
}

function getConfig(): { baseUrl: string; apiKey: string } | null {
  const baseUrl = import.meta.env.VITE_SUPABASE_URL
  const apiKey = import.meta.env.VITE_SUPABASE_ANON_KEY
  if (!baseUrl || !apiKey) return null
  return { baseUrl, apiKey }
}

async function getTableCount(name: string): Promise<TableStatus> {
  const cfg = getConfig()
  if (!cfg) return { name, ok: false, count: 0, error: 'Supabase not configured' }

  try {
    const res = await fetch(`${cfg.baseUrl}/rest/v1/${name}?select=count`, {
      method: 'HEAD',
      headers: {
        apikey: cfg.apiKey,
        Authorization: `Bearer ${cfg.apiKey}`,
        Prefer: 'count=exact',
      },
    })

    const cr = res.headers.get('content-range')
    const count = cr ? parseInt(cr.split('/')[1], 10) : 0
    return { name, ok: res.ok, count: isNaN(count) ? 0 : count, error: res.ok ? undefined : `${res.status}` }
  } catch (e) {
    return { name, ok: false, count: 0, error: e instanceof Error ? e.message : String(e) }
  }
}

function DebugPage() {
  const [env, setEnv] = useState<Record<string, string>>({})
  const [clientOk, setClientOk] = useState(false)
  const [clientError, setClientError] = useState<string | null>(null)
  const [dbOk, setDbOk] = useState<boolean | null>(null)
  const [dbError, setDbError] = useState<string | null>(null)
  const [tables, setTables] = useState<TableStatus[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setEnv({
      VITE_USE_SUPABASE: import.meta.env.VITE_USE_SUPABASE ?? '(not set)',
      VITE_SUPABASE_URL: import.meta.env.VITE_SUPABASE_URL ?? '(not set)',
      VITE_SUPABASE_ANON_KEY: import.meta.env.VITE_SUPABASE_ANON_KEY
        ? `${import.meta.env.VITE_SUPABASE_ANON_KEY.substring(0, 12)}...`
        : '(not set)',
      MODE: import.meta.env.MODE,
    })

    const enabled = isSupabaseEnabled()
    if (!enabled) {
      setClientError('VITE_USE_SUPABASE is not "true" — using mock data')
      setLoading(false)
      return
    }

    const cfg = getConfig()
    if (!cfg) {
      setClientError('Missing VITE_SUPABASE_URL or VITE_SUPABASE_ANON_KEY')
      setLoading(false)
      return
    }
    setClientOk(true)

    const checkTables = async () => {
      try {
        const tableNames = ['patients', 'doctors', 'appointments', 'conversations', 'messages', 'medical_notes', 'visits', 'notifications']
        const results = await Promise.all(tableNames.map(getTableCount))

        setTables(results)
        setDbOk(results.every((r) => r.ok))
        setDbError(results.find((r) => !r.ok)?.error ?? null)
      } catch (e) {
        setDbOk(false)
        setDbError(e instanceof Error ? e.message : 'Unknown error')
      }
      setLoading(false)
    }

    checkTables()
  }, [])

  return (
    <>
      <Header />
      <Main className='space-y-6 p-6'>
        <h1 className='text-2xl font-bold tracking-tight'>Supabase Debug</h1>

        <section className='rounded-lg border p-4'>
          <h2 className='mb-3 text-lg font-semibold'>Environment Variables</h2>
          <pre className='overflow-x-auto rounded bg-muted p-3 text-sm'>
            {JSON.stringify(env, null, 2)}
          </pre>
        </section>

        <section className='rounded-lg border p-4'>
          <h2 className='mb-3 text-lg font-semibold'>Client Initialization</h2>
          {clientOk ? (
            <p className='text-green-600'>✅ Supabase client created successfully</p>
          ) : (
            <p className='text-red-600'>❌ {clientError}</p>
          )}
        </section>

        <section className='rounded-lg border p-4'>
          <h2 className='mb-3 text-lg font-semibold'>Database Connection</h2>
          {loading ? (
            <p>Checking tables...</p>
          ) : dbOk === null ? (
            <p className='text-yellow-600'>⚠ Not checked (client not available)</p>
          ) : dbOk ? (
            <p className='text-green-600'>✅ All 8 tables accessible</p>
          ) : (
            <div>
              <p className='text-red-600'>❌ Connection error: {dbError}</p>
            </div>
          )}
        </section>

        <section className='rounded-lg border p-4'>
          <h2 className='mb-3 text-lg font-semibold'>Table Status</h2>
          {loading ? (
            <p>Loading...</p>
          ) : tables.length === 0 ? (
            <p className='text-yellow-600'>No tables checked</p>
          ) : (
            <table className='w-full text-sm'>
              <thead>
                <tr className='border-b text-left'>
                  <th className='pb-2 pr-4 font-medium'>Table</th>
                  <th className='pb-2 pr-4 font-medium'>Status</th>
                  <th className='pb-2 font-medium'>Rows</th>
                </tr>
              </thead>
              <tbody>
                {tables.map((t) => (
                  <tr key={t.name} className='border-b last:border-0'>
                    <td className='py-2 pr-4 font-mono'>{t.name}</td>
                    <td className='py-2 pr-4'>
                      {t.ok ? (
                        <span className='text-green-600'>✅ OK</span>
                      ) : (
                        <span className='text-red-600' title={t.error}>❌ {t.error}</span>
                      )}
                    </td>
                    <td className='py-2'>{t.count}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </section>

        {!loading && tables.length > 0 && (
          <section className='rounded-lg border p-4'>
            <h2 className='mb-3 text-lg font-semibold'>Summary</h2>
            <ul className='space-y-1 text-sm'>
              <li>Patients: <strong>{tables.find((t) => t.name === 'patients')?.count ?? '?'}</strong></li>
              <li>Doctors: <strong>{tables.find((t) => t.name === 'doctors')?.count ?? '?'}</strong></li>
              <li>Appointments: <strong>{tables.find((t) => t.name === 'appointments')?.count ?? '?'}</strong></li>
              <li className='pt-2 text-muted-foreground'>
                {dbOk
                  ? '✅ Supabase is fully connected. App is using real data.'
                  : '❌ Supabase has connection issues. App may fall back to mock data.'}
              </li>
            </ul>
          </section>
        )}
      </Main>
    </>
  )
}

export const Route = createFileRoute('/_authenticated/debug')({
  component: DebugPage,
})
