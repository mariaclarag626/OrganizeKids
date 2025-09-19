import { drizzle } from 'drizzle-orm/postgres-js'
import postgres from 'postgres'

// Import individual exports from schema
import {
    accounts,
    accountsRelations,
    householdMembers,
    householdMembersRelations,
    households,
    householdsRelations,
    profiles,
    profilesRelations,
    sessions,
    sessionsRelations,
    tasks,
    tasksRelations,
    userPoints,
    userPointsRelations,
    users,
    usersRelations,
    verificationTokens,
} from './schema'

const connectionString = process.env.DATABASE_URL!

// Disable prefetch as it's not supported for "Transaction" pool mode
const client = postgres(connectionString, { prepare: false })

// Create schema object
const schema = {
  users,
  accounts,
  sessions,
  verificationTokens,
  households,
  householdMembers,
  profiles,
  tasks,
  userPoints,
  usersRelations,
  accountsRelations,
  sessionsRelations,
  householdsRelations,
  householdMembersRelations,
  profilesRelations,
  tasksRelations,
  userPointsRelations,
}

export const db = drizzle(client, { schema })

// Export types
export type Database = typeof db

// Re-export everything from schema
export * from './schema'

