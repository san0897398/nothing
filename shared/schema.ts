import { sql } from 'drizzle-orm';
import { relations } from 'drizzle-orm';
import {
  index,
  jsonb,
  pgTable,
  timestamp,
  varchar,
  text,
  integer,
  boolean,
  serial,
} from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Session storage table.
export const sessions = pgTable(
  "sessions",
  {
    sid: varchar("sid").primaryKey(),
    sess: jsonb("sess").notNull(),
    expire: timestamp("expire").notNull(),
  },
  (table) => [index("IDX_session_expire").on(table.expire)],
);

// User storage table.
export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  email: varchar("email").unique(),
  firstName: varchar("first_name"),
  lastName: varchar("last_name"),
  profileImageUrl: varchar("profile_image_url"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Learning packs table
export const learningPacks = pgTable("learning_packs", {
  id: serial("id").primaryKey(),
  title: varchar("title", { length: 255 }).notNull(),
  description: text("description"),
  category: varchar("category", { length: 100 }),
  difficulty: varchar("difficulty", { length: 20 }), // 'beginner', 'intermediate', 'advanced'
  duration: integer("duration"), // in minutes
  rating: integer("rating"), // 1-5 stars (multiplied by 10 for decimal precision)
  content: jsonb("content").notNull(), // JSON structure for learning content
  tags: text("tags").array(),
  isPublic: boolean("is_public").default(true),
  authorId: varchar("author_id").references(() => users.id),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// User learning progress table
export const userProgress = pgTable("user_progress", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id").notNull().references(() => users.id),
  packId: integer("pack_id").notNull().references(() => learningPacks.id),
  progress: integer("progress").default(0), // 0-100
  status: varchar("status", { length: 20 }).default("not_started"), // 'not_started', 'in_progress', 'completed', 'paused'
  timeSpent: integer("time_spent").default(0), // in seconds
  lastAccessedAt: timestamp("last_accessed_at").defaultNow(),
  completedAt: timestamp("completed_at"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Chat messages table
export const chatMessages = pgTable("chat_messages", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id").notNull().references(() => users.id),
  message: text("message").notNull(),
  role: varchar("role", { length: 20 }).notNull(), // 'user', 'assistant'
  packId: integer("pack_id").references(() => learningPacks.id), // optional, if related to specific pack
  metadata: jsonb("metadata"), // for storing additional context, file references, etc.
  createdAt: timestamp("created_at").defaultNow(),
});

// User activities table for AI recommendations
export const userActivities = pgTable("user_activities", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id").notNull().references(() => users.id),
  activityType: varchar("activity_type", { length: 50 }).notNull(), // 'pack_started', 'pack_completed', 'chat_interaction', etc.
  entityId: integer("entity_id"), // could reference pack_id or other entities
  metadata: jsonb("metadata"), // additional context data
  createdAt: timestamp("created_at").defaultNow(),
});

// File uploads table
export const fileUploads = pgTable("file_uploads", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id").notNull().references(() => users.id),
  filename: varchar("filename", { length: 255 }).notNull(),
  originalName: varchar("original_name", { length: 255 }).notNull(),
  fileType: varchar("file_type", { length: 100 }),
  fileSize: integer("file_size"),
  objectPath: text("object_path").notNull(),
  metadata: jsonb("metadata"),
  createdAt: timestamp("created_at").defaultNow(),
});

// Relations
export const usersRelations = relations(users, ({ many }) => ({
  learningPacks: many(learningPacks),
  progress: many(userProgress),
  chatMessages: many(chatMessages),
  activities: many(userActivities),
  fileUploads: many(fileUploads),
}));

export const learningPacksRelations = relations(learningPacks, ({ one, many }) => ({
  author: one(users, {
    fields: [learningPacks.authorId],
    references: [users.id],
  }),
  progress: many(userProgress),
  chatMessages: many(chatMessages),
}));

export const userProgressRelations = relations(userProgress, ({ one }) => ({
  user: one(users, {
    fields: [userProgress.userId],
    references: [users.id],
  }),
  pack: one(learningPacks, {
    fields: [userProgress.packId],
    references: [learningPacks.id],
  }),
}));

export const chatMessagesRelations = relations(chatMessages, ({ one }) => ({
  user: one(users, {
    fields: [chatMessages.userId],
    references: [users.id],
  }),
  pack: one(learningPacks, {
    fields: [chatMessages.packId],
    references: [learningPacks.id],
  }),
}));

export const userActivitiesRelations = relations(userActivities, ({ one }) => ({
  user: one(users, {
    fields: [userActivities.userId],
    references: [users.id],
  }),
}));

export const fileUploadsRelations = relations(fileUploads, ({ one }) => ({
  user: one(users, {
    fields: [fileUploads.userId],
    references: [users.id],
  }),
}));

// Export schemas
export type UpsertUser = typeof users.$inferInsert;
export type User = typeof users.$inferSelect;

export const insertLearningPackSchema = createInsertSchema(learningPacks).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});
export type InsertLearningPack = z.infer<typeof insertLearningPackSchema>;
export type LearningPack = typeof learningPacks.$inferSelect;

export const insertUserProgressSchema = createInsertSchema(userProgress).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});
export type InsertUserProgress = z.infer<typeof insertUserProgressSchema>;
export type UserProgress = typeof userProgress.$inferSelect;

export const insertChatMessageSchema = createInsertSchema(chatMessages).omit({
  id: true,
  createdAt: true,
});
export type InsertChatMessage = z.infer<typeof insertChatMessageSchema>;
export type ChatMessage = typeof chatMessages.$inferSelect;

export const insertUserActivitySchema = createInsertSchema(userActivities).omit({
  id: true,
  createdAt: true,
});
export type InsertUserActivity = z.infer<typeof insertUserActivitySchema>;
export type UserActivity = typeof userActivities.$inferSelect;

export const insertFileUploadSchema = createInsertSchema(fileUploads).omit({
  id: true,
  createdAt: true,
});
export type InsertFileUpload = z.infer<typeof insertFileUploadSchema>;
export type FileUpload = typeof fileUploads.$inferSelect;
