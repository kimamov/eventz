import z from "zod"

//@TODO: this should move to another shared file and should be adjusted
export const Image=z.object({ 
    width: z.int().positive().min(1),
    height: z.int().positive().min(1),
    url: z.string().min(1),
    alt: z.string().optional(),
})

export const Event=z.object({
    id: z.string(),
    slug: z.string().min(1),
    title: z.string().min(1),
    summary: z.string().min(1),
    description: z.string().min(1),
    thumbnail: Image,
    coverImage: Image,
    capacity: z.int().positive().optional(),
    guests: z.int().positive(),
    images: z.array(Image),

})

export const EventSummary=Event.pick({
    title: true,
    summary: true,
    slug: true,
    thumbnail: true,
    capacity: true,
    guests: true
}).extend({
    thumbnail: Image,
})


