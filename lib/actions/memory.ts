"use server";

import crypto from "crypto";
import { prisma } from "@/lib/prisma";
import { generateEmbedding } from "@/lib/embeddings";

export async function storeMemory(userId: string, content: string, sessionId?: string) {
  try {
    const embedding = await generateEmbedding(content);
    const vectorStr = `[${embedding.join(",")}]`;
    const memoryId = crypto.randomUUID();

    await prisma.$executeRaw`
      INSERT INTO "memory" (id, content, "userId", "sessionId", embedding, "createdAt")
      VALUES (${memoryId}, ${content}, ${userId}, ${sessionId || null}, ${vectorStr}::vector, NOW())
    `;
  } catch (error) {
    console.error("Error storing memory:", error);
  }
}

export async function getRelevantMemories(userId: string, message: string, limit: number = 3) {
  try {
    const embedding = await generateEmbedding(message);
    const vectorStr = `[${embedding.join(",")}]`;

    const memories = await prisma.$queryRaw<{ content: string }[]>`
      SELECT content 
      FROM "memory" 
      WHERE "userId" = ${userId} 
      ORDER BY embedding <=> ${vectorStr}::vector 
      LIMIT ${limit};
    `;

    return memories.map(m => m.content);
  } catch (error) {
    console.error("Error retrieving memories:", error);
    return [];
  }
}
