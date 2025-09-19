// Temporary simplified database config to avoid client-side issues
export const db = null

// Export types only
export type Database = any

// Re-export schema types
export type {
  Account,
  Household,
  HouseholdMember,
  NewAccount,
  NewHousehold,
  NewHouseholdMember,
  NewProfile,
  NewSession,
  NewTask,
  NewUser,
  NewUserPoints,
  NewVerificationToken,
  Profile,
  Session,
  Task,
  User,
  UserPoints,
  VerificationToken,
} from './schema'
