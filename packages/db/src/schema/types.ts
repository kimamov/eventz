import { customType } from 'drizzle-orm/pg-core'

// PostGIS geography (WGS84 / SRID 4326 by default). Distances are in metres.
export const geography = customType<{ data: string }>({
  dataType: () => 'geography',
})
