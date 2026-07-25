import { Router } from "express";
import { z } from "zod";
import { requireAuth } from "../middleware/auth.js";
import { getDb } from "../config/firebase.js";
import { encrypt, decrypt } from "../utils/encryption.js";
import { createSupabaseServiceClient } from "../config/supabase.js";
import { randomUUID } from "crypto";

export const chatsRouter = Router();

const createChatSchema = z.object({
  listing_id: z.string().uuid(),
  seller_id: z.string().uuid(),
  initial_message: z.string(),
});

chatsRouter.post("/api/v1/chats", requireAuth, async (req, res, next): Promise<void> => {
  try {
    const parseResult = createChatSchema.safeParse(req.body);
    if (!parseResult.success) {
      res.status(400).json({ error: "Invalid payload format", details: parseResult.error });
      return;
    }

    const { listing_id, seller_id, initial_message } = parseResult.data;
    const buyer_id = (req as any).user.id;

    if (buyer_id === seller_id) {
      res.status(400).json({ error: "Cannot start a chat with yourself" });
      return;
    }

    const chatsRef = getDb().collection("chats");
    const snapshot = await chatsRef
      .where("buyer_id", "==", buyer_id)
      .where("seller_id", "==", seller_id)
      .where("listing_id", "==", listing_id)
      .limit(1)
      .get();

    let chatId = "";

    if (snapshot.empty) {
      chatId = randomUUID();
      await chatsRef.doc(chatId).set({
        id: chatId,
        buyer_id,
        seller_id,
        listing_id,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      });
    } else {
      chatId = snapshot.docs[0].id;
    }

    const messageId = randomUUID();
    const encryptedMsg = encrypt(initial_message);
    
    await chatsRef.doc(chatId).collection("messages").doc(messageId).set({
      id: messageId,
      chat_id: chatId,
      sender_id: buyer_id,
      message_text: encryptedMsg,
      is_read: false,
      created_at: new Date().toISOString()
    });

    res.status(200).json({ chat_id: chatId });
  } catch (error) {
    next(error);
  }
});

chatsRouter.get("/api/v1/chats", requireAuth, async (req, res, next): Promise<void> => {
  try {
    const userId = (req as any).user.id;

    const chatsRef = getDb().collection("chats");
    const buyerQuery = chatsRef.where("buyer_id", "==", userId).get();
    const sellerQuery = chatsRef.where("seller_id", "==", userId).get();

    const [buyerSnapshot, sellerSnapshot] = await Promise.all([buyerQuery, sellerQuery]);
    
    const chatsMap = new Map();
    buyerSnapshot.docs.forEach(doc => chatsMap.set(doc.id, doc.data()));
    sellerSnapshot.docs.forEach(doc => chatsMap.set(doc.id, doc.data()));

    const chats = Array.from(chatsMap.values());

    const supabase = createSupabaseServiceClient();
    if (!supabase) {
      res.status(500).json({ error: "Supabase client not configured" });
      return;
    }

    const populatedChats = await Promise.all(chats.map(async (chat) => {
      const { data: listing } = await supabase
        .from("listings")
        .select("title, price_label")
        .eq("id", chat.listing_id)
        .single();

      const { data: buyer } = await supabase
        .from("profiles")
        .select("id, email, trust_score")
        .eq("id", chat.buyer_id)
        .single();
        
      const { data: seller } = await supabase
        .from("profiles")
        .select("id, email, trust_score")
        .eq("id", chat.seller_id)
        .single();

      const messagesSnapshot = await getDb().collection("chats")
        .doc(chat.id)
        .collection("messages")
        .orderBy("created_at", "desc")
        .limit(1)
        .get();

      const messages = messagesSnapshot.docs.map(doc => {
        const msg = doc.data();
        return {
          ...msg,
          message_text: decrypt(msg.message_text)
        };
      });

      return {
        ...chat,
        listing,
        buyer,
        seller,
        messages
      };
    }));

    populatedChats.sort((a, b) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime());

    res.status(200).json({ items: populatedChats });
  } catch (error) {
    next(error);
  }
});

chatsRouter.get("/api/v1/chats/:id", requireAuth, async (req, res, next): Promise<void> => {
  try {
    const userId = (req as any).user.id;
    const chatId = req.params.id;

    const chatDoc = await getDb().collection("chats").doc(chatId).get();
    if (!chatDoc.exists) {
      res.status(404).json({ error: "Chat not found" });
      return;
    }

    const chatData = chatDoc.data()!;
    if (chatData.buyer_id !== userId && chatData.seller_id !== userId) {
      res.status(403).json({ error: "Access denied" });
      return;
    }

    const supabase = createSupabaseServiceClient();
    if (!supabase) {
      res.status(500).json({ error: "Supabase client not configured" });
      return;
    }

    const { data: listing } = await supabase
      .from("listings")
      .select("title, price_label")
      .eq("id", chatData.listing_id)
      .single();

    const { data: buyer } = await supabase
      .from("profiles")
      .select("id, email, trust_score")
      .eq("id", chatData.buyer_id)
      .single();
      
    const { data: seller } = await supabase
      .from("profiles")
      .select("id, email, trust_score")
      .eq("id", chatData.seller_id)
      .single();

    const messagesSnapshot = await getDb().collection("chats")
      .doc(chatId)
      .collection("messages")
      .orderBy("created_at", "asc")
      .get();

    const messages = messagesSnapshot.docs.map(doc => {
      const msg = doc.data();
      return {
        ...msg,
        message_text: decrypt(msg.message_text)
      };
    });

    res.status(200).json({
      ...chatData,
      listing,
      buyer,
      seller,
      messages
    });
  } catch (error) {
    next(error);
  }
});
