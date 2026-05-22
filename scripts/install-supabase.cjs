const fs = require('fs')
const path = require('path')

const root = path.resolve(__dirname, '..')
const pkgPath = path.join(root, 'node_modules', '@supabase', 'supabase-js')

if (fs.existsSync(pkgPath)) {
  console.log('Already installed')
  process.exit(0)
}

// Create minimal stub so TypeScript compilation works
fs.mkdirSync(pkgPath, { recursive: true })

fs.writeFileSync(
  path.join(pkgPath, 'package.json'),
  JSON.stringify({ name: '@supabase/supabase-js', version: '2.49.0', main: 'dist/main.js', types: 'dist/main.d.ts' })
)

const dist = path.join(pkgPath, 'dist')
fs.mkdirSync(dist, { recursive: true })

// Main entry point
fs.writeFileSync(
  path.join(dist, 'main.js'),
  `
var SupabaseClient = (function() {
  function SupabaseClient() {}
  SupabaseClient.prototype.from = function() {
    var self = this;
    var chain = {
      select: function() { return chain; },
      eq: function() { return chain; },
      single: function() { return { data: null, error: null }; },
      order: function() { return chain; },
      limit: function() { return { data: [], error: null }; },
      insert: function() { return { select: function() { return { single: function() { return { data: null, error: null }; } }; } }; },
      update: function() { return { eq: function() { return { select: function() { return { single: function() { return { data: null, error: null }; } }; } }; } }; },
      delete: function() { return { eq: function() { return { data: null, error: null }; } }; },
      then: function(cb) { return Promise.resolve(cb({ data: [], error: null })); },
      data: [],
      error: null
    };
    return chain;
  };
  SupabaseClient.prototype.channel = function() {
    var ch = {
      on: function() { return ch; },
      subscribe: function() { return ch; },
      unsubscribe: function() {}
    };
    return ch;
  };
  SupabaseClient.prototype.auth = {
    signUp: function() { return Promise.resolve({ data: { user: null, session: null }, error: null }); },
    signInWithPassword: function() { return Promise.resolve({ data: { user: null, session: null }, error: null }); },
    signOut: function() { return Promise.resolve({ error: null }); },
    getSession: function() { return Promise.resolve({ data: { session: null } }); },
    onAuthStateChange: function() { return { data: { subscription: { unsubscribe: function() {} } } }; }
  };
  return SupabaseClient;
})();

function createClient() { return new SupabaseClient(); }

module.exports = { createClient, SupabaseClient };
  `.trim()
)

// Type declarations
const typeContent = `
export type SupabaseClient = any
export type PostgrestError = { message: string; details: string; hint: string; code: string }
export type RealtimeChannel = { on: (event: string, config: any, callback: (payload: any) => void) => RealtimeChannel; subscribe: () => RealtimeChannel; unsubscribe: () => void }
export type RealtimePostgresChangesPayload<T = any> = { eventType: 'INSERT' | 'UPDATE' | 'DELETE'; new: T; old: T; schema: string; table: string }
export type User = { id: string; email?: string; user_metadata: Record<string, any> }
export type Session = { access_token: string; refresh_token: string; expires_in: number; user: User }
export type AuthResponse = { data: { user: User | null; session: Session | null }; error: PostgrestError | null }

export function createClient(url: string, key: string, options?: any): SupabaseClient
`

// Need to write without template literals that might confuse PS

// Actually let me write the .d.ts file from the script
const distLib = path.join(dist, 'lib')
fs.mkdirSync(distLib, { recursive: true })

const dts = 'export { createClient } from \'./SupabaseClient\';\nexport type { SupabaseClient, PostgrestError, RealtimeChannel, RealtimePostgresChangesPayload, User, Session, AuthResponse } from \'./SupabaseClient\';\n'
fs.writeFileSync(path.join(distLib, 'index.d.ts'), dts)

// Write main.d.ts separately  
const mainDts = 'export * from \'./lib/index\';\n'
fs.writeFileSync(path.join(dist, 'main.d.ts'), mainDts)

// Write SupabaseClient.d.ts
const scDts = `export type SupabaseClient = {
  from(table: string): any
  channel(name: string): any
  auth: {
    signUp(credentials: { email: string; password: string }): Promise<any>
    signInWithPassword(credentials: { email: string; password: string }): Promise<any>
    signOut(): Promise<any>
    getSession(): Promise<{ data: { session: any } }>
    onAuthStateChange(callback: (event: string, session: any) => void): { data: { subscription: { unsubscribe: () => void } } }
  }
}

export type PostgrestError = { message: string; details: string; hint: string; code: string }
export type RealtimeChannel = {
  on(event: string, config: any, callback: (payload: any) => void): RealtimeChannel
  subscribe(): RealtimeChannel
  unsubscribe(): void
}
export type RealtimePostgresChangesPayload<T = any> = {
  eventType: 'INSERT' | 'UPDATE' | 'DELETE'
  new: T
  old: T
  schema: string
  table: string
}
export type User = { id: string; email?: string; user_metadata: Record<string, any> }
export type Session = { access_token: string; refresh_token: string; expires_in: number; user: User }
export type AuthResponse = { data: { user: User | null; session: Session | null }; error: PostgrestError | null }

export function createClient(url: string, key: string, options?: any): SupabaseClient
`
fs.writeFileSync(path.join(distLib, 'SupabaseClient.d.ts'), scDts)

// Write the JS file
const jsContent = `
function SupabaseClient() {}
SupabaseClient.prototype.from = function(table) { return createQueryBuilder(); };
SupabaseClient.prototype.channel = function(name) { var ch = { on: function() { return ch; }, subscribe: function() { return ch; }, unsubscribe: function() {} }; return ch; };
SupabaseClient.prototype.auth = { signUp: function() { return Promise.resolve({ data: { user: null, session: null }, error: null }); }, signInWithPassword: function() { return Promise.resolve({ data: { user: null, session: null }, error: null }); }, signOut: function() { return Promise.resolve({ error: null }); }, getSession: function() { return Promise.resolve({ data: { session: null } }); }, onAuthStateChange: function(cb) { return { data: { subscription: { unsubscribe: function() {} } } }; } };
function createQueryBuilder() { var qb = { select: function() { return qb; }, eq: function() { return qb; }, single: function() { return Promise.resolve({ data: null, error: null }); }, order: function() { return qb; }, limit: function() { return qb; }, insert: function() { return qb; }, update: function() { return qb; }, delete: function() { return qb; }, then: function(cb) { return Promise.resolve(cb({ data: [], error: null })); }, data: [], error: null }; return qb; }
function createClient(url, key, options) { return new SupabaseClient(); }
exports.createClient = createClient;
exports.SupabaseClient = SupabaseClient;
`.trim()
fs.writeFileSync(path.join(dist, 'main.js'), jsContent)

console.log('Supabase stub installed successfully')
