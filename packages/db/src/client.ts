import { drizzle } from 'drizzle-orm/postgres-js'
import postgres from 'postgres'
import * as schema from './schema'

// A factory, not a module-level singleton: the app decides when to create
// the one instance per process, and tests can create their own.
export function createDb(url: string) {
  const client = postgres(url)
  return drizzle({ client, schema })
}

export type Db = ReturnType<typeof createDb>
