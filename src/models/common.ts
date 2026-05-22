import { z } from 'zod'

/** Structured postal address */
export const AddressSchema = z.object({
  street: z.string().min(1, 'Street is required'),
  city: z.string().min(1, 'City is required'),
  state: z.string().min(1, 'State is required'),
  postalCode: z.string().min(1, 'Postal code is required'),
  country: z.string().min(1, 'Country is required').default('US'),
})
export type Address = z.infer<typeof AddressSchema>

/** Emergency contact person */
export const EmergencyContactSchema = z.object({
  name: z.string().min(1, 'Contact name is required'),
  phone: z.string().min(1, 'Contact phone is required'),
  relationship: z.string().min(1, 'Relationship is required'),
})
export type EmergencyContact = z.infer<typeof EmergencyContactSchema>

/** Insurance coverage details */
export const InsuranceSchema = z.object({
  provider: z.string().min(1, 'Insurance provider is required'),
  policyId: z.string().min(1, 'Policy ID is required'),
  groupId: z.string().optional(),
  coverageStart: z.string().optional(),
  coverageEnd: z.string().optional(),
})
export type Insurance = z.infer<typeof InsuranceSchema>

/** Audit timestamps baked into every entity */
export const TimestampsSchema = z.object({
  createdAt: z.string().datetime({ offset: true }).or(z.string().min(1)),
  updatedAt: z.string().datetime({ offset: true }).or(z.string().min(1)),
})
export type Timestamps = z.infer<typeof TimestampsSchema>

/** Paginated API response envelope */
export const PaginatedResponseSchema = <T extends z.ZodTypeAny>(item: T) =>
  z.object({
    data: z.array(item),
    total: z.number().nonnegative(),
    page: z.number().int().positive(),
    pageSize: z.number().int().positive(),
    totalPages: z.number().int().nonnegative(),
  })
