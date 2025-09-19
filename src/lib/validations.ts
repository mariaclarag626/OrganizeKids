import { z } from 'zod'

// Auth schemas
export const signInSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
})

export const profileSchema = z.object({
  displayName: z.string().min(2, 'Display name must be at least 2 characters'),
  dateOfBirth: z.date().optional(),
})

// Household schemas
export const householdSchema = z.object({
  name: z.string().min(2, 'Household name must be at least 2 characters'),
  description: z.string().optional(),
})

export const householdMemberSchema = z.object({
  role: z.enum(['parent', 'teenager', 'child']),
  email: z.string().email('Please enter a valid email address').optional(),
})

// Task schemas
export const taskSchema = z.object({
  title: z.string().min(1, 'Task title is required'),
  description: z.string().optional(),
  points: z.number().min(0, 'Points must be positive').default(0),
  dueDate: z.date().optional(),
  assignedTo: z.string().uuid().optional(),
})

// Types
export type SignInFormData = z.infer<typeof signInSchema>
export type ProfileFormData = z.infer<typeof profileSchema>
export type HouseholdFormData = z.infer<typeof householdSchema>
export type HouseholdMemberFormData = z.infer<typeof householdMemberSchema>
export type TaskFormData = z.infer<typeof taskSchema>