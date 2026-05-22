export type Patient = {
  id: string
  name: string
  email: string
  phoneNumber: string
  status: 'active' | 'inactive' | 'invited' | 'suspended'
  carePlan: string
  lastVisit: string
}
