import { Province } from "./province"

export type City = {
    id: string
    name: string
    province: Province | null
  }
  