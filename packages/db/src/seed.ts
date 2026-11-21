// Local development seed: wipes the tables and inserts a small, predictable data set.
// Run from the repo root with `bun run db:seed` (needs DATABASE_URL in .env).
import { sql } from 'drizzle-orm'
import { createDb } from './client'
import { attendances, events, users } from './schema'

const url = process.env.DATABASE_URL
if (!url) throw new Error('DATABASE_URL is not set')

// Safety net: this script deletes data, so never run it against a remote database.
const host = new URL(url).hostname
if (!['localhost', '127.0.0.1', '::1'].includes(host)) {
  throw new Error(`Refusing to seed non-local database at "${host}"`)
}

const db = createDb(url)

const DAY = 24 * 60 * 60 * 1000
const HOUR = 60 * 60 * 1000
const today = new Date()
today.setUTCHours(0, 0, 0, 0)

/** Start of the day `days` from today, plus `hour` hours (UTC). */
const at = (days: number, hour: number) => new Date(today.getTime() + days * DAY + hour * HOUR)

/** PostGIS point. Note the order: longitude first, then latitude. */
const point = (lng: number, lat: number) =>
  sql`ST_SetSRID(ST_MakePoint(${lng}, ${lat}), 4326)::geography`

const userSeed = ['Mira', 'Jonas', 'Lea', 'Kemal', 'Sofia', 'Ben']

type EventSeed = {
  label: string // only for the log output; the table has no title column yet
  host: number // index into userSeed
  lng: number
  lat: number
  status: 'draft' | 'published' | 'cancelled'
  startsAt: Date
  durationHours: number | null
  attendees: number[] // indexes into userSeed
}

const eventSeed: EventSeed[] = [
  {
    label: 'Rooftop party, Kreuzberg',
    host: 0,
    lng: 13.4034,
    lat: 52.4996,
    status: 'published',
    startsAt: at(3, 19),
    durationHours: 6,
    attendees: [1, 2, 3, 4],
  },
  {
    label: 'Board game night, Friedrichshain',
    host: 1,
    lng: 13.4542,
    lat: 52.5125,
    status: 'published',
    startsAt: at(5, 18),
    durationHours: 4,
    attendees: [0, 2],
  },
  {
    label: 'Techno in a courtyard, Neukölln',
    host: 2,
    lng: 13.4381,
    lat: 52.4811,
    status: 'published',
    startsAt: at(9, 21),
    durationHours: null,
    attendees: [0, 1, 3, 4, 5],
  },
  {
    label: 'Picnic at Tempelhofer Feld',
    host: 3,
    lng: 13.4017,
    lat: 52.4731,
    status: 'published',
    startsAt: at(12, 12),
    durationHours: 5,
    attendees: [5],
  },
  {
    label: 'Vinyl swap, Prenzlauer Berg',
    host: 4,
    lng: 13.4132,
    lat: 52.5388,
    status: 'draft',
    startsAt: at(20, 15),
    durationHours: 3,
    attendees: [],
  },
  {
    label: 'Karaoke birthday, Mitte',
    host: 0,
    lng: 13.4049,
    lat: 52.5208,
    status: 'cancelled',
    startsAt: at(6, 20),
    durationHours: 4,
    attendees: [2, 3],
  },
  {
    label: 'House party, Schöneberg (already happened)',
    host: 5,
    lng: 13.3537,
    lat: 52.4826,
    status: 'published',
    startsAt: at(-7, 20),
    durationHours: 6,
    attendees: [0, 1, 2],
  },
  {
    label: 'Isar summer party, Munich',
    host: 1,
    lng: 11.5856,
    lat: 48.1203,
    status: 'published',
    startsAt: at(14, 17),
    durationHours: 7,
    attendees: [4],
  },
  {
    label: 'Harbour boat party, Hamburg',
    host: 3,
    lng: 9.9661,
    lat: 53.5444,
    status: 'published',
    startsAt: at(21, 19),
    durationHours: 5,
    attendees: [0, 5],
  },
]

await db.transaction(async (tx) => {
  await tx.execute(sql`truncate table ${attendances}, ${events}, ${users} cascade`)

  const insertedUsers = await tx
    .insert(users)
    .values(userSeed.map((name) => ({ name })))
    .returning({ id: users.id })

  const userId = (index: number) => {
    const user = insertedUsers[index]
    if (!user) throw new Error(`Seed refers to unknown user #${index}`)
    return user.id
  }

  for (const e of eventSeed) {
    const [event] = await tx
      .insert(events)
      .values({
        hostId: userId(e.host),
        location: point(e.lng, e.lat),
        status: e.status,
        startsAt: e.startsAt,
        endsAt: e.durationHours ? new Date(e.startsAt.getTime() + e.durationHours * HOUR) : null,
      })
      .returning({ id: events.id })
    if (!event) throw new Error(`Insert of "${e.label}" returned nothing`)

    if (e.attendees.length > 0) {
      await tx
        .insert(attendances)
        .values(e.attendees.map((i) => ({ eventId: event.id, attendeeId: userId(i) })))
    }

    console.log(`  ${e.status.padEnd(9)} ${e.label} (${e.attendees.length} attending)`)
  }
})

console.log(`Seeded ${userSeed.length} users and ${eventSeed.length} events.`)
await db.$client.end()
