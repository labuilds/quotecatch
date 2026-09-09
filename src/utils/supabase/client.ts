import { createBrowserClient } from '@supabase/ssr'

// Singleton pattern — critical for PKCE code verifier persistence across renders.
// If a new client is instantiated per render, the code verifier stored in the
// initial client's cookie jar is lost before the auth callback can read it.
let client: ReturnType<typeof createBrowserClient> | undefined

export function createClient() {
  if (client) return client

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co'
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder-anon-key'
  
  client = createBrowserClient(
    supabaseUrl,
    supabaseAnonKey,
    {
      auth: {
        lock: async (name: string, acquireTimeout: number, fn: () => Promise<any>) => {
          return await fn();
        },
      }
    }
  )
  
  return client
}
