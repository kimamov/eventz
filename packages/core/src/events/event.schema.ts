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
  name: z.string().min(1).trim().max(256),
})

export type Attendee = z.infer<typeof AttendeeSchema>

export const EventSchema = z.object({
  id: z.ulid(),
  title: z.string().min(1).trim().max(256),
  summary: z.string().min(1).trim().max(512), // this gets automaticly get generated from description and can be adjusted
  description: z.string().min(1).trim().max(2000),
  thumbnail: ImageSchema,
  coverImage: ImageSchema.nullable(),
  capacity: z.int().positive().nullable(),
  spotsLeft: z.int().nonnegative().nullable(),
  images: z.array(ImageSchema),
  attendees: z.array(AttendeeSchema),
})

export type EventRecord = z.infer<typeof EventSchema>

export const EventSummarySchema = EventSchema.pick({
  id: true,
  title: true,
  summary: true,
  thumbnail: true,
  capacity: true,
  spotsLeft: true,
})

export type EventSummary = z.infer<typeof EventSummarySchema>
