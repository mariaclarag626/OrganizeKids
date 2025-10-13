import {
  pgTable,
  text,
  timestamp,
  uuid,
  varchar,
  integer,
  boolean,
  jsonb,
  index,
  primaryKey,
} from 'drizzle-orm/pg-core'
import { relations } from 'drizzle-orm'

// Users table for authentication
export const users = pgTable('users', {
  id: uuid('id').defaultRandom().primaryKey(),
  email: varchar('email', { length: 255 }).notNull().unique(),
  emailVerified: timestamp('email_verified', { mode: 'date' }),
  name: varchar('name', { length: 255 }),
  image: text('image'),
  password: text('password'), // Hash da senha para autenticação por email/senha
  userType: varchar('user_type', { length: 50 }), // 'parents', 'teenagers', 'kids'
  createdAt: timestamp('created_at', { mode: 'date' }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { mode: 'date' }).defaultNow().notNull(),
}, (table) => ({
  emailIdx: index('users_email_idx').on(table.email),
}))

// Accounts table for OAuth providers
export const accounts = pgTable('accounts', {
  userId: uuid('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  type: varchar('type', { length: 255 }).notNull(),
  provider: varchar('provider', { length: 255 }).notNull(),
  providerAccountId: varchar('provider_account_id', { length: 255 }).notNull(),
  refresh_token: text('refresh_token'),
  access_token: text('access_token'),
  expires_at: integer('expires_at'),
  token_type: varchar('token_type', { length: 255 }),
  scope: varchar('scope', { length: 255 }),
  id_token: text('id_token'),
  session_state: varchar('session_state', { length: 255 }),
}, (table) => ({
  compoundKey: primaryKey({ columns: [table.provider, table.providerAccountId] }),
}))

// Sessions table for session management
export const sessions = pgTable('sessions', {
  sessionToken: varchar('session_token', { length: 255 }).notNull().primaryKey(),
  userId: uuid('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  expires: timestamp('expires', { mode: 'date' }).notNull(),
})

// Verification tokens for email verification
export const verificationTokens = pgTable('verification_tokens', {
  identifier: varchar('identifier', { length: 255 }).notNull(),
  token: varchar('token', { length: 255 }).notNull(),
  expires: timestamp('expires', { mode: 'date' }).notNull(),
}, (table) => ({
  compoundKey: primaryKey({ columns: [table.identifier, table.token] }),
}))

// Households table - represents family units
export const households = pgTable('households', {
  id: uuid('id').defaultRandom().primaryKey(),
  name: varchar('name', { length: 255 }).notNull(),
  description: text('description'),
  settings: jsonb('settings').default({}),
  createdAt: timestamp('created_at', { mode: 'date' }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { mode: 'date' }).defaultNow().notNull(),
  createdBy: uuid('created_by').notNull().references(() => users.id),
}, (table) => ({
  createdByIdx: index('households_created_by_idx').on(table.createdBy),
}))

// User roles within households
export const householdMembers = pgTable('household_members', {
  id: uuid('id').defaultRandom().primaryKey(),
  householdId: uuid('household_id').notNull().references(() => households.id, { onDelete: 'cascade' }),
  userId: uuid('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  role: varchar('role', { length: 50 }).notNull().default('child'), // 'parent', 'teenager', 'child'
  isActive: boolean('is_active').default(true),
  joinedAt: timestamp('joined_at', { mode: 'date' }).defaultNow().notNull(),
}, (table) => ({
  householdUserIdx: index('household_members_household_user_idx').on(table.householdId, table.userId),
}))

// User profiles with additional information
export const profiles = pgTable('profiles', {
  id: uuid('id').defaultRandom().primaryKey(),
  userId: uuid('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }).unique(),
  displayName: varchar('display_name', { length: 255 }),
  avatar: text('avatar'),
  dateOfBirth: timestamp('date_of_birth', { mode: 'date' }),
  preferences: jsonb('preferences').default({}),
  createdAt: timestamp('created_at', { mode: 'date' }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { mode: 'date' }).defaultNow().notNull(),
}, (table) => ({
  userIdx: index('profiles_user_idx').on(table.userId),
}))

// Tasks/chores within households
export const tasks = pgTable('tasks', {
  id: uuid('id').defaultRandom().primaryKey(),
  householdId: uuid('household_id').notNull().references(() => households.id, { onDelete: 'cascade' }),
  title: varchar('title', { length: 255 }).notNull(),
  description: text('description'),
  points: integer('points').default(0),
  isCompleted: boolean('is_completed').default(false),
  completedAt: timestamp('completed_at', { mode: 'date' }),
  completedBy: uuid('completed_by').references(() => users.id),
  assignedTo: uuid('assigned_to').references(() => users.id),
  dueDate: timestamp('due_date', { mode: 'date' }),
  createdAt: timestamp('created_at', { mode: 'date' }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { mode: 'date' }).defaultNow().notNull(),
  createdBy: uuid('created_by').notNull().references(() => users.id),
}, (table) => ({
  householdIdx: index('tasks_household_idx').on(table.householdId),
  assignedToIdx: index('tasks_assigned_to_idx').on(table.assignedTo),
  completedByIdx: index('tasks_completed_by_idx').on(table.completedBy),
}))

// User points/rewards tracking
export const userPoints = pgTable('user_points', {
  id: uuid('id').defaultRandom().primaryKey(),
  userId: uuid('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  householdId: uuid('household_id').notNull().references(() => households.id, { onDelete: 'cascade' }),
  points: integer('points').default(0),
  totalEarned: integer('total_earned').default(0),
  totalSpent: integer('total_spent').default(0),
  lastUpdated: timestamp('last_updated', { mode: 'date' }).defaultNow().notNull(),
}, (table) => ({
  userHouseholdIdx: index('user_points_user_household_idx').on(table.userId, table.householdId),
}))

// Relations
export const usersRelations = relations(users, ({ many, one }) => ({
  accounts: many(accounts),
  sessions: many(sessions),
  profile: one(profiles),
  householdMemberships: many(householdMembers),
  createdHouseholds: many(households),
  assignedTasks: many(tasks, { relationName: 'assignedTasks' }),
  completedTasks: many(tasks, { relationName: 'completedTasks' }),
  createdTasks: many(tasks, { relationName: 'createdTasks' }),
  points: many(userPoints),
}))

export const accountsRelations = relations(accounts, ({ one }) => ({
  user: one(users, {
    fields: [accounts.userId],
    references: [users.id],
  }),
}))

export const sessionsRelations = relations(sessions, ({ one }) => ({
  user: one(users, {
    fields: [sessions.userId],
    references: [users.id],
  }),
}))

export const householdsRelations = relations(households, ({ many, one }) => ({
  members: many(householdMembers),
  tasks: many(tasks),
  createdBy: one(users, {
    fields: [households.createdBy],
    references: [users.id],
  }),
  userPoints: many(userPoints),
}))

export const householdMembersRelations = relations(householdMembers, ({ one }) => ({
  household: one(households, {
    fields: [householdMembers.householdId],
    references: [households.id],
  }),
  user: one(users, {
    fields: [householdMembers.userId],
    references: [users.id],
  }),
}))

export const profilesRelations = relations(profiles, ({ one }) => ({
  user: one(users, {
    fields: [profiles.userId],
    references: [users.id],
  }),
}))

export const tasksRelations = relations(tasks, ({ one }) => ({
  household: one(households, {
    fields: [tasks.householdId],
    references: [households.id],
  }),
  assignedTo: one(users, {
    fields: [tasks.assignedTo],
    references: [users.id],
    relationName: 'assignedTasks',
  }),
  completedBy: one(users, {
    fields: [tasks.completedBy],
    references: [users.id],
    relationName: 'completedTasks',
  }),
  createdBy: one(users, {
    fields: [tasks.createdBy],
    references: [users.id],
    relationName: 'createdTasks',
  }),
}))

export const userPointsRelations = relations(userPoints, ({ one }) => ({
  user: one(users, {
    fields: [userPoints.userId],
    references: [users.id],
  }),
  household: one(households, {
    fields: [userPoints.householdId],
    references: [households.id],
  }),
}))

// Rewards/prizes that can be purchased with points
export const rewards = pgTable('rewards', {
  id: uuid('id').defaultRandom().primaryKey(),
  householdId: uuid('household_id').notNull().references(() => households.id, { onDelete: 'cascade' }),
  title: varchar('title', { length: 255 }).notNull(),
  description: text('description'),
  cost: integer('cost').notNull().default(0),
  icon: varchar('icon', { length: 100 }).default('🎁'),
  isActive: boolean('is_active').default(true),
  stock: integer('stock'), // null = unlimited
  createdAt: timestamp('created_at', { mode: 'date' }).defaultNow().notNull(),
  createdBy: uuid('created_by').notNull().references(() => users.id),
}, (table) => ({
  householdIdx: index('rewards_household_idx').on(table.householdId),
}))

// Reward redemptions
export const rewardRedemptions = pgTable('reward_redemptions', {
  id: uuid('id').defaultRandom().primaryKey(),
  rewardId: uuid('reward_id').notNull().references(() => rewards.id, { onDelete: 'cascade' }),
  userId: uuid('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  householdId: uuid('household_id').notNull().references(() => households.id, { onDelete: 'cascade' }),
  pointsSpent: integer('points_spent').notNull(),
  status: varchar('status', { length: 50 }).default('pending'), // 'pending', 'approved', 'delivered'
  redeemedAt: timestamp('redeemed_at', { mode: 'date' }).defaultNow().notNull(),
  approvedAt: timestamp('approved_at', { mode: 'date' }),
  approvedBy: uuid('approved_by').references(() => users.id),
}, (table) => ({
  userIdx: index('reward_redemptions_user_idx').on(table.userId),
  householdIdx: index('reward_redemptions_household_idx').on(table.householdId),
}))

// Achievements/badges
export const achievements = pgTable('achievements', {
  id: uuid('id').defaultRandom().primaryKey(),
  code: varchar('code', { length: 100 }).notNull().unique(), // 'first_task', 'streak_7', etc
  title: varchar('title', { length: 255 }).notNull(),
  description: text('description'),
  icon: varchar('icon', { length: 100 }).default('🏆'),
  category: varchar('category', { length: 50 }), // 'tasks', 'streaks', 'points', etc
  requirement: integer('requirement'), // number needed to unlock
  createdAt: timestamp('created_at', { mode: 'date' }).defaultNow().notNull(),
})

// User achievements
export const userAchievements = pgTable('user_achievements', {
  id: uuid('id').defaultRandom().primaryKey(),
  userId: uuid('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  achievementId: uuid('achievement_id').notNull().references(() => achievements.id, { onDelete: 'cascade' }),
  unlockedAt: timestamp('unlocked_at', { mode: 'date' }).defaultNow().notNull(),
  progress: integer('progress').default(0),
}, (table) => ({
  userIdx: index('user_achievements_user_idx').on(table.userId),
}))

// Avatar customization options
export const avatarCustomizations = pgTable('avatar_customizations', {
  id: uuid('id').defaultRandom().primaryKey(),
  userId: uuid('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }).unique(),
  skinColor: varchar('skin_color', { length: 50 }).default('#FFD1A4'),
  hairStyle: varchar('hair_style', { length: 50 }).default('short'),
  hairColor: varchar('hair_color', { length: 50 }).default('#4A3728'),
  eyeStyle: varchar('eye_style', { length: 50 }).default('happy'),
  mouthStyle: varchar('mouth_style', { length: 50 }).default('smile'),
  outfit: varchar('outfit', { length: 50 }).default('casual'),
  accessories: jsonb('accessories').default([]),
  background: varchar('background', { length: 50 }).default('stars'),
  createdAt: timestamp('created_at', { mode: 'date' }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { mode: 'date' }).defaultNow().notNull(),
}, (table) => ({
  userIdx: index('avatar_customizations_user_idx').on(table.userId),
}))

// Relations for new tables
export const rewardsRelations = relations(rewards, ({ one, many }) => ({
  household: one(households, {
    fields: [rewards.householdId],
    references: [households.id],
  }),
  createdBy: one(users, {
    fields: [rewards.createdBy],
    references: [users.id],
  }),
  redemptions: many(rewardRedemptions),
}))

export const rewardRedemptionsRelations = relations(rewardRedemptions, ({ one }) => ({
  reward: one(rewards, {
    fields: [rewardRedemptions.rewardId],
    references: [rewards.id],
  }),
  user: one(users, {
    fields: [rewardRedemptions.userId],
    references: [users.id],
  }),
  household: one(households, {
    fields: [rewardRedemptions.householdId],
    references: [households.id],
  }),
  approvedBy: one(users, {
    fields: [rewardRedemptions.approvedBy],
    references: [users.id],
  }),
}))

export const achievementsRelations = relations(achievements, ({ many }) => ({
  userAchievements: many(userAchievements),
}))

export const userAchievementsRelations = relations(userAchievements, ({ one }) => ({
  user: one(users, {
    fields: [userAchievements.userId],
    references: [users.id],
  }),
  achievement: one(achievements, {
    fields: [userAchievements.achievementId],
    references: [achievements.id],
  }),
}))

export const avatarCustomizationsRelations = relations(avatarCustomizations, ({ one }) => ({
  user: one(users, {
    fields: [avatarCustomizations.userId],
    references: [users.id],
  }),
}))

// Task suggestions (kids suggest tasks for parent approval)
export const taskSuggestions = pgTable('task_suggestions', {
  id: uuid('id').defaultRandom().primaryKey(),
  householdId: uuid('household_id').notNull().references(() => households.id, { onDelete: 'cascade' }),
  suggestedBy: uuid('suggested_by').notNull().references(() => users.id, { onDelete: 'cascade' }),
  title: varchar('title', { length: 255 }).notNull(),
  description: text('description'),
  pointsSuggested: integer('points_suggested').notNull().default(10),
  status: varchar('status', { length: 50 }).notNull().default('pending'), // 'pending', 'approved', 'rejected'
  reviewedBy: uuid('reviewed_by').references(() => users.id),
  reviewNotes: text('review_notes'),
  pointsApproved: integer('points_approved'),
  createdAt: timestamp('created_at', { mode: 'date' }).defaultNow().notNull(),
  reviewedAt: timestamp('reviewed_at', { mode: 'date' }),
}, (table) => ({
  householdIdx: index('task_suggestions_household_idx').on(table.householdId),
  statusIdx: index('task_suggestions_status_idx').on(table.status),
}))

export const taskSuggestionsRelations = relations(taskSuggestions, ({ one }) => ({
  household: one(households, {
    fields: [taskSuggestions.householdId],
    references: [households.id],
  }),
  suggestedBy: one(users, {
    fields: [taskSuggestions.suggestedBy],
    references: [users.id],
    relationName: 'suggestedTasks',
  }),
  reviewedBy: one(users, {
    fields: [taskSuggestions.reviewedBy],
    references: [users.id],
    relationName: 'reviewedSuggestions',
  }),
}))

// Types
export type User = typeof users.$inferSelect
export type NewUser = typeof users.$inferInsert
export type Account = typeof accounts.$inferSelect
export type NewAccount = typeof accounts.$inferInsert
export type Session = typeof sessions.$inferSelect
export type NewSession = typeof sessions.$inferInsert
export type VerificationToken = typeof verificationTokens.$inferSelect
export type NewVerificationToken = typeof verificationTokens.$inferInsert
export type Household = typeof households.$inferSelect
export type NewHousehold = typeof households.$inferInsert
export type HouseholdMember = typeof householdMembers.$inferSelect
export type NewHouseholdMember = typeof householdMembers.$inferInsert
export type Profile = typeof profiles.$inferSelect
export type NewProfile = typeof profiles.$inferInsert
export type Task = typeof tasks.$inferSelect
export type NewTask = typeof tasks.$inferInsert
export type UserPoints = typeof userPoints.$inferSelect
export type NewUserPoints = typeof userPoints.$inferInsert
export type Reward = typeof rewards.$inferSelect
export type NewReward = typeof rewards.$inferInsert
export type RewardRedemption = typeof rewardRedemptions.$inferSelect
export type NewRewardRedemption = typeof rewardRedemptions.$inferInsert
export type Achievement = typeof achievements.$inferSelect
export type NewAchievement = typeof achievements.$inferInsert
export type UserAchievement = typeof userAchievements.$inferSelect
export type NewUserAchievement = typeof userAchievements.$inferInsert
export type AvatarCustomization = typeof avatarCustomizations.$inferSelect
export type NewAvatarCustomization = typeof avatarCustomizations.$inferInsert
export type TaskSuggestion = typeof taskSuggestions.$inferSelect
export type NewTaskSuggestion = typeof taskSuggestions.$inferInsert