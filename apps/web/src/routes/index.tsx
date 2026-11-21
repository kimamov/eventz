import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/')({
  component: HomePage,
})

function HomePage() {
  return (
    <section>
      <h1 className="text-2xl font-semibold">Upcoming events</h1>
      <p className="mt-2 text-muted-foreground">Nothing here yet.</p>
    </section>
  )
}
