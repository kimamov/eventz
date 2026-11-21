import { sql } from 'drizzle-orm'
import { pgEnum, pgTable, timestamp, uuid } from 'drizzle-orm/pg-core'
import { geography } from './types'
import { users } from './users'

export const eventStatus = pgEnum('event_status', ['draft', 'published', 'cancelled'])

export const events = pgTable(
  'events',
  {
    id: uuid('id').primaryKey().default(sql`uuidv7()`),
    hostId: uuid('host_id')
      .notNull()
      .references(() => users.id, { onDelete: 'restrict' }),
    location: geography('location').notNull(),
    status: eventStatus('status').notNull().default('draft'),
    startsAt: timestamp('starts_at', { withTimezone: true }).notNull(),
    endsAt: timestamp('ends_at', { withTimezone: true }),
    createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp('updated_at', { withTimezone: true })
      .notNull()
      .defaultNow()
      .$onUpdate(() => new Date()),
  },
  // (t)=>[

  // ]
)
