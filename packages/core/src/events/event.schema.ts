import z from "zod"

export const Event=z.object({
    title: z.string().min(1),
})

export const EventSummary=Event.pick({

}).extend({

})


