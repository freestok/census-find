export interface GeomNameQuery {
  name: string
  geoid: string
  stusps: string
  link?: string
}

export interface CensusGeoms {
  state: GeomNameQuery[]
  county: GeomNameQuery[]
  place: GeomNameQuery[]
  tract: GeomNameQuery[]
}

export interface Templates {
  id: number
  title: string
}
export type GeomTypes = 'state' | 'county' | 'place' | 'tract'
export type QueryType = 'all' | 'any'
export type NumberType = 'value' | 'percent'
