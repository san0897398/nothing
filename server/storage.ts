import {
  users,
  learningPacks,
  userProgress,
  chatMessages,
  userActivities,
  fileUploads,
  type User,
  type UpsertUser,
  type LearningPack,
  type InsertLearningPack,
  type UserProgress,
  type InsertUserProgress,
  type ChatMessage,
  type InsertChatMessage,
  type InsertUserActivity,
  type UserActivity,
  type InsertFileUpload,
  type FileUpload,
} from "@shared/schema";
import { db } from "./db";
import { eq, desc, and, or, sql, ilike } from "drizzle-orm";

export interface IStorage {
  // User operations
  getUser(id: string): Promise<User | undefined>;
  upsertUser(user: UpsertUser): Promise<User>;
  
  // Learning pack operations
  getLearningPacks(params?: {
    category?: string;
    difficulty?: string;
    search?: string;
    limit?: number;
    offset?: number;
  }): Promise<LearningPack[]>;
  getLearningPack(id: number): Promise<LearningPack | undefined>;
  createLearningPack(pack: InsertLearningPack): Promise<LearningPack>;
  updateLearningPack(id: number, pack: Partial<InsertLearningPack>): Promise<LearningPack | undefined>;
  deleteLearningPack(id: number): Promise<boolean>;
  
  // User progress operations
  getUserProgress(userId: string, packId?: number): Promise<UserProgress[]>;
  updateUserProgress(progress: InsertUserProgress): Promise<UserProgress>;
  getCurrentLearning(userId: string): Promise<(UserProgress & { pack: LearningPack }) | undefined>;
  
  // Chat operations
  getChatMessages(userId: string, limit?: number): Promise<ChatMessage[]>;
  addChatMessage(message: InsertChatMessage): Promise<ChatMessage>;
  
  // Activity tracking
  addUserActivity(activity: InsertUserActivity): Promise<UserActivity>;
  getUserActivities(userId: string, limit?: number): Promise<UserActivity[]>;
  
  // File upload operations
  addFileUpload(file: InsertFileUpload): Promise<FileUpload>;
  getUserFileUploads(userId: string): Promise<FileUpload[]>;
  
  // AI recommendations
  getRecommendedPacks(userId: string, limit?: number): Promise<LearningPack[]>;
  getRecentActivities(userId: string, limit?: number): Promise<(UserProgress & { pack: LearningPack })[]>;
}

export class DatabaseStorage implements IStorage {
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async upsertUser(userData: UpsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(userData)
      .onConflictDoUpdate({
        target: users.id,
        set: {
          ...userData,
          updatedAt: new Date(),
        },
      })
      .returning();
    return user;
  }

  async getLearningPacks(params?: {
    category?: string;
    difficulty?: string;
    search?: string;
    limit?: number;
    offset?: number;
  }): Promise<LearningPack[]> {
    const { category, difficulty, search, limit = 20, offset = 0 } = params || {};
    
    let query = db.select().from(learningPacks).where(eq(learningPacks.isPublic, true));
    
    const conditions = [];
    
    if (category) {
      conditions.push(eq(learningPacks.category, category));
    }
    
    if (difficulty) {
      conditions.push(eq(learningPacks.difficulty, difficulty));
    }
    
    if (search) {
      conditions.push(
        or(
          ilike(learningPacks.title, `%${search}%`),
          ilike(learningPacks.description, `%${search}%`)
        )
      );
    }
    
    if (conditions.length > 0) {
      query = query.where(and(...conditions));
    }
    
    return query
      .orderBy(desc(learningPacks.createdAt))
      .limit(limit)
      .offset(offset);
  }

  async getLearningPack(id: number): Promise<LearningPack | undefined> {
    const [pack] = await db.select().from(learningPacks).where(eq(learningPacks.id, id));
    return pack;
  }

  async createLearningPack(pack: InsertLearningPack): Promise<LearningPack> {
    const [newPack] = await db.insert(learningPacks).values(pack).returning();
    return newPack;
  }

  async updateLearningPack(id: number, pack: Partial<InsertLearningPack>): Promise<LearningPack | undefined> {
    const [updatedPack] = await db
      .update(learningPacks)
      .set({ ...pack, updatedAt: new Date() })
      .where(eq(learningPacks.id, id))
      .returning();
    return updatedPack;
  }

  async deleteLearningPack(id: number): Promise<boolean> {
    const result = await db.delete(learningPacks).where(eq(learningPacks.id, id));
    return result.rowCount > 0;
  }

  async getUserProgress(userId: string, packId?: number): Promise<UserProgress[]> {
    let query = db.select().from(userProgress).where(eq(userProgress.userId, userId));
    
    if (packId) {
      query = query.where(and(eq(userProgress.userId, userId), eq(userProgress.packId, packId)));
    }
    
    return query.orderBy(desc(userProgress.lastAccessedAt));
  }

  async updateUserProgress(progress: InsertUserProgress): Promise<UserProgress> {
    const existing = await db
      .select()
      .from(userProgress)
      .where(
        and(
          eq(userProgress.userId, progress.userId),
          eq(userProgress.packId, progress.packId)
        )
      );

    if (existing.length > 0) {
      const [updated] = await db
        .update(userProgress)
        .set({
          ...progress,
          updatedAt: new Date(),
          lastAccessedAt: new Date(),
        })
        .where(eq(userProgress.id, existing[0].id))
        .returning();
      return updated;
    } else {
      const [created] = await db
        .insert(userProgress)
        .values({
          ...progress,
          lastAccessedAt: new Date(),
        })
        .returning();
      return created;
    }
  }

  async getCurrentLearning(userId: string): Promise<(UserProgress & { pack: LearningPack }) | undefined> {
    const result = await db
      .select({
        id: userProgress.id,
        userId: userProgress.userId,
        packId: userProgress.packId,
        progress: userProgress.progress,
        status: userProgress.status,
        timeSpent: userProgress.timeSpent,
        lastAccessedAt: userProgress.lastAccessedAt,
        completedAt: userProgress.completedAt,
        createdAt: userProgress.createdAt,
        updatedAt: userProgress.updatedAt,
        pack: learningPacks,
      })
      .from(userProgress)
      .innerJoin(learningPacks, eq(userProgress.packId, learningPacks.id))
      .where(
        and(
          eq(userProgress.userId, userId),
          eq(userProgress.status, "in_progress")
        )
      )
      .orderBy(desc(userProgress.lastAccessedAt))
      .limit(1);

    return result[0];
  }

  async getChatMessages(userId: string, limit: number = 50): Promise<ChatMessage[]> {
    return db
      .select()
      .from(chatMessages)
      .where(eq(chatMessages.userId, userId))
      .orderBy(desc(chatMessages.createdAt))
      .limit(limit);
  }

  async addChatMessage(message: InsertChatMessage): Promise<ChatMessage> {
    const [newMessage] = await db.insert(chatMessages).values(message).returning();
    return newMessage;
  }

  async addUserActivity(activity: InsertUserActivity): Promise<UserActivity> {
    const [newActivity] = await db.insert(userActivities).values(activity).returning();
    return newActivity;
  }

  async getUserActivities(userId: string, limit: number = 20): Promise<UserActivity[]> {
    return db
      .select()
      .from(userActivities)
      .where(eq(userActivities.userId, userId))
      .orderBy(desc(userActivities.createdAt))
      .limit(limit);
  }

  async addFileUpload(file: InsertFileUpload): Promise<FileUpload> {
    const [newFile] = await db.insert(fileUploads).values(file).returning();
    return newFile;
  }

  async getUserFileUploads(userId: string): Promise<FileUpload[]> {
    return db
      .select()
      .from(fileUploads)
      .where(eq(fileUploads.userId, userId))
      .orderBy(desc(fileUploads.createdAt));
  }

  async getRecommendedPacks(userId: string, limit: number = 5): Promise<LearningPack[]> {
    // Simple recommendation based on categories of completed packs and high ratings
    const userActivitiesData = await db
      .select({ entityId: userActivities.entityId })
      .from(userActivities)
      .where(
        and(
          eq(userActivities.userId, userId),
          eq(userActivities.activityType, "pack_completed")
        )
      );

    const completedPackIds = userActivitiesData
      .map(a => a.entityId)
      .filter(id => id !== null);

    if (completedPackIds.length === 0) {
      // If no completed packs, return highest rated packs
      return db
        .select()
        .from(learningPacks)
        .where(eq(learningPacks.isPublic, true))
        .orderBy(desc(learningPacks.rating))
        .limit(limit);
    }

    // Get categories of completed packs
    const completedPacks = await db
      .select({ category: learningPacks.category })
      .from(learningPacks)
      .where(
        and(
          eq(learningPacks.isPublic, true),
          sql`${learningPacks.id} IN (${completedPackIds.join(',')})`
        )
      );

    const categories = [...new Set(completedPacks.map(p => p.category))];

    // Return packs from similar categories, excluding already completed ones
    return db
      .select()
      .from(learningPacks)
      .where(
        and(
          eq(learningPacks.isPublic, true),
          sql`${learningPacks.category} IN (${categories.map(c => `'${c}'`).join(',')})`,
          sql`${learningPacks.id} NOT IN (${completedPackIds.join(',')})`
        )
      )
      .orderBy(desc(learningPacks.rating))
      .limit(limit);
  }

  async getRecentActivities(userId: string, limit: number = 5): Promise<(UserProgress & { pack: LearningPack })[]> {
    return db
      .select({
        id: userProgress.id,
        userId: userProgress.userId,
        packId: userProgress.packId,
        progress: userProgress.progress,
        status: userProgress.status,
        timeSpent: userProgress.timeSpent,
        lastAccessedAt: userProgress.lastAccessedAt,
        completedAt: userProgress.completedAt,
        createdAt: userProgress.createdAt,
        updatedAt: userProgress.updatedAt,
        pack: learningPacks,
      })
      .from(userProgress)
      .innerJoin(learningPacks, eq(userProgress.packId, learningPacks.id))
      .where(eq(userProgress.userId, userId))
      .orderBy(desc(userProgress.lastAccessedAt))
      .limit(limit);
  }
}

export const storage = new DatabaseStorage();
