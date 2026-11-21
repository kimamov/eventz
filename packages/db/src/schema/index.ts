// Re-export every table from here, one file per table (events.ts, users.ts, ...).
// drizzle-kit reads this file to generate migrations.

export { attendances } from './attendances'
export { events, eventStatus } from './events'
export { users } from './users'
