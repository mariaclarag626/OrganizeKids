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

// Add new tables to schema (imported from ./schema)
import {
  rewards,
  rewardsRelations,
  rewardRedemptions,
  rewardRedemptionsRelations,
  achievements,
  achievementsRelations,
  userAchievements,
  userAchievementsRelations,
  avatarCustomizations,
  avatarCustomizationsRelations,
} from './schema'

const fullSchema = {
  ...schema,
  rewards,
  rewardsRelations,
  rewardRedemptions,
  rewardRedemptionsRelations,
  achievements,
  achievementsRelations,
  userAchievements,
  userAchievementsRelations,
  avatarCustomizations,
  avatarCustomizationsRelations,
}

// Safe database initialization - only connect if DATABASE_URL is provided
let db: ReturnType<typeof drizzle> | null = null

if (process.env.DATABASE_URL) {
  try {
    const connectionString = process.env.DATABASE_URL
    // Disable prefetch as it's not supported for "Transaction" pool mode
    const client = postgres(connectionString, { prepare: false })
    db = drizzle(client, { schema: fullSchema })
  } catch (error) {
    console.warn('Failed to connect to database:', error)
    db = null
  }
} else {
  console.warn('DATABASE_URL not set - database features will be disabled')
}

export { db }

// Export types
export type Database = typeof db

// Re-export everything from schema
export * from './schema'

