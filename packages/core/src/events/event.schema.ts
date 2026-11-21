import z from 'zod'

//@TODO: this should move to another shared file and should be adjusted
export const ImageSchema = z.object({
  width: z.int().positive(),
  height: z.int().positive(),
  url: z.string().min(1),
  alt: z.string().optional(),
})

export type ImageRecord = z.infer<typeof ImageSchema>

//@TODO: extend this later
export const AttendeeSchema = z.object({
  id: z.ulid(),
  name: z.string().trim().min(1).max(256),
})

export type Attendee = z.infer<typeof AttendeeSchema>

export const TimeZoneSchema = z.string().refine((tz: string) => {
  try {
    new Intl.DateTimeFormat('en', { timeZone: tz })
    return true
  } catch {
    return false
  }
}, 'Invalid IANA time zone')

export const EventDetailSchema = z.object({
  id: z.ulid(),
  title: z.string().min(1).trim().max(256),
  summary: z.string().min(1).trim().max(512), // this gets automaticly get generated from description and can be adjusted
  description: z.string().trim().min(1).max(2000),
  thumbnail: ImageSchema,
  coverImage: ImageSchema.nullable(),
  capacity: z.int().positive().nullable(),
  spotsLeft: z.int().nonnegative().nullable(),
  //   images: z.array(ImageSchema),
  //   attendees: z.array(AttendeeSchema),
  startsAt: z.iso.datetime(),
  endsAt: z.iso.datetime(),
  timezone: TimeZoneSchema,
  
})

export type EventDetail = z.infer<typeof EventDetailSchema>

export const EventCardSchema = EventDetailSchema.pick({
  id: true,
  title: true,
  summary: true,
  thumbnail: true,
  capacity: true,
  spotsLeft: true,
  startsAt: true,
  endsAt: true,
  timezone: true,
})

export type EventCard = z.infer<typeof EventCardSchema>
