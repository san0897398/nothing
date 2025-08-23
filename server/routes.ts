import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { setupAuth, isAuthenticated } from "./replitAuth";
import {
  ObjectStorageService,
  ObjectNotFoundError,
} from "./objectStorage";
import { ObjectPermission } from "./objectAcl";
import { 
  generateChatResponse, 
  generateLearningRecommendations,
  processUploadedFile 
} from "./openai";
import { 
  insertLearningPackSchema, 
  insertUserProgressSchema,
  insertChatMessageSchema 
} from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  // Auth middleware
  await setupAuth(app);

  // Auth routes
  app.get('/api/auth/user', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const user = await storage.getUser(userId);
      res.json(user);
    } catch (error) {
      console.error("Error fetching user:", error);
      res.status(500).json({ message: "Failed to fetch user" });
    }
  });

  // Learning pack routes
  app.get('/api/learning-packs', async (req, res) => {
    try {
      const { category, difficulty, search, limit, offset } = req.query;
      const packs = await storage.getLearningPacks({
        category: category as string,
        difficulty: difficulty as string,
        search: search as string,
        limit: limit ? parseInt(limit as string) : undefined,
        offset: offset ? parseInt(offset as string) : undefined,
      });
      res.json(packs);
    } catch (error) {
      console.error("Error fetching learning packs:", error);
      res.status(500).json({ message: "Failed to fetch learning packs" });
    }
  });

  app.get('/api/learning-packs/:id', async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const pack = await storage.getLearningPack(id);
      if (!pack) {
        return res.status(404).json({ message: "Learning pack not found" });
      }
      res.json(pack);
    } catch (error) {
      console.error("Error fetching learning pack:", error);
      res.status(500).json({ message: "Failed to fetch learning pack" });
    }
  });

  app.post('/api/learning-packs', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const packData = insertLearningPackSchema.parse({
        ...req.body,
        authorId: userId,
      });
      
      const pack = await storage.createLearningPack(packData);
      res.status(201).json(pack);
    } catch (error) {
      console.error("Error creating learning pack:", error);
      res.status(400).json({ message: "Failed to create learning pack" });
    }
  });

  // User progress routes
  app.get('/api/user-progress', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const packId = req.query.packId ? parseInt(req.query.packId as string) : undefined;
      const progress = await storage.getUserProgress(userId, packId);
      res.json(progress);
    } catch (error) {
      console.error("Error fetching user progress:", error);
      res.status(500).json({ message: "Failed to fetch user progress" });
    }
  });

  app.put('/api/user-progress', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const progressData = insertUserProgressSchema.parse({
        ...req.body,
        userId,
      });
      
      const progress = await storage.updateUserProgress(progressData);
      
      // Track activity
      await storage.addUserActivity({
        userId,
        activityType: progressData.status === 'completed' ? 'pack_completed' : 'progress_updated',
        entityId: progressData.packId,
        metadata: { progress: progressData.progress },
      });
      
      res.json(progress);
    } catch (error) {
      console.error("Error updating user progress:", error);
      res.status(400).json({ message: "Failed to update user progress" });
    }
  });

  app.get('/api/current-learning', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const currentLearning = await storage.getCurrentLearning(userId);
      res.json(currentLearning || null);
    } catch (error) {
      console.error("Error fetching current learning:", error);
      res.status(500).json({ message: "Failed to fetch current learning" });
    }
  });

  // Dashboard data route
  app.get('/api/dashboard', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      
      const [currentLearning, recommendedPacks, recentActivities] = await Promise.all([
        storage.getCurrentLearning(userId),
        storage.getRecommendedPacks(userId, 5),
        storage.getRecentActivities(userId, 5),
      ]);

      res.json({
        currentLearning,
        recommendedPacks,
        recentActivities,
      });
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
      res.status(500).json({ message: "Failed to fetch dashboard data" });
    }
  });

  // Chat routes
  app.get('/api/chat-messages', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const limit = req.query.limit ? parseInt(req.query.limit as string) : 50;
      const messages = await storage.getChatMessages(userId, limit);
      res.json(messages.reverse()); // Return in chronological order
    } catch (error) {
      console.error("Error fetching chat messages:", error);
      res.status(500).json({ message: "Failed to fetch chat messages" });
    }
  });

  app.post('/api/chat-messages', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const messageData = insertChatMessageSchema.parse({
        ...req.body,
        userId,
        role: 'user',
      });
      
      // Save user message
      const userMessage = await storage.addChatMessage(messageData);
      
      // Get context for AI response
      const [currentLearning, recentActivities, userProgress] = await Promise.all([
        storage.getCurrentLearning(userId),
        storage.getRecentActivities(userId, 5),
        storage.getUserProgress(userId),
      ]);
      
      // Generate AI response
      const aiResponse = await generateChatResponse(messageData.message, {
        userId,
        currentPack: currentLearning?.pack,
        recentActivities,
        userProgress,
      });
      
      // Save AI response
      const aiMessage = await storage.addChatMessage({
        userId,
        message: aiResponse.message,
        role: 'assistant',
        metadata: {
          suggestions: aiResponse.suggestions,
          actions: aiResponse.actions,
        },
      });
      
      // Track chat activity
      await storage.addUserActivity({
        userId,
        activityType: 'chat_interaction',
        metadata: { messageLength: messageData.message.length },
      });
      
      res.json({ userMessage, aiMessage });
    } catch (error) {
      console.error("Error processing chat message:", error);
      res.status(500).json({ message: "Failed to process chat message" });
    }
  });

  // File upload routes
  app.post("/api/objects/upload", isAuthenticated, async (req, res) => {
    try {
      const objectStorageService = new ObjectStorageService();
      const uploadURL = await objectStorageService.getObjectEntityUploadURL();
      res.json({ uploadURL });
    } catch (error) {
      console.error("Error getting upload URL:", error);
      res.status(500).json({ error: "Failed to get upload URL" });
    }
  });

  app.put("/api/file-uploads", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      
      if (!req.body.uploadURL) {
        return res.status(400).json({ error: "uploadURL is required" });
      }

      const objectStorageService = new ObjectStorageService();
      const objectPath = await objectStorageService.trySetObjectEntityAclPolicy(
        req.body.uploadURL,
        {
          owner: userId,
          visibility: "private",
        }
      );

      const fileUpload = await storage.addFileUpload({
        userId,
        filename: req.body.filename || 'uploaded_file',
        originalName: req.body.originalName || req.body.filename || 'uploaded_file',
        fileType: req.body.fileType || 'application/octet-stream',
        fileSize: req.body.fileSize || 0,
        objectPath,
        metadata: req.body.metadata || {},
      });

      // Track file upload activity
      await storage.addUserActivity({
        userId,
        activityType: 'file_uploaded',
        metadata: { 
          filename: fileUpload.filename,
          fileType: fileUpload.fileType,
        },
      });

      res.json({ fileUpload, objectPath });
    } catch (error) {
      console.error("Error saving file upload:", error);
      res.status(500).json({ error: "Failed to save file upload" });
    }
  });

  // Object serving route
  app.get("/objects/:objectPath(*)", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const objectStorageService = new ObjectStorageService();
      
      const objectFile = await objectStorageService.getObjectEntityFile(req.path);
      const canAccess = await objectStorageService.canAccessObjectEntity({
        objectFile,
        userId: userId,
        requestedPermission: ObjectPermission.READ,
      });
      
      if (!canAccess) {
        return res.sendStatus(403);
      }
      
      objectStorageService.downloadObject(objectFile, res);
    } catch (error) {
      console.error("Error accessing object:", error);
      if (error instanceof ObjectNotFoundError) {
        return res.sendStatus(404);
      }
      return res.sendStatus(500);
    }
  });

  // AI recommendations route
  app.get('/api/recommendations', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const [userActivities, recentActivities, recommendedPacks] = await Promise.all([
        storage.getUserActivities(userId, 20),
        storage.getRecentActivities(userId, 10),
        storage.getRecommendedPacks(userId, 10),
      ]);

      const aiRecommendations = await generateLearningRecommendations(
        userId,
        userActivities,
        recentActivities.map(r => r.pack)
      );

      res.json({
        aiRecommendations,
        recommendedPacks,
        userActivities: userActivities.slice(0, 5),
      });
    } catch (error) {
      console.error("Error generating recommendations:", error);
      res.status(500).json({ message: "Failed to generate recommendations" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
