import { Router } from "express";
import { z } from "zod";
import { requireAuth } from "../middleware/auth.js";
import { encrypt, decrypt } from "../utils/encryption.js";
import { createSupabaseServiceClient } from "../config/supabase.js";

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

    const supabase = createSupabaseServiceClient();
    if (!supabase) {
      res.status(500).json({ error: "Supabase client not configured" });
      return;
    }

    // Check if chat exists
    let { data: chat } = await supabase
      .from("chats")
      .select("id")
      .eq("buyer_id", buyer_id)
      .eq("seller_id", seller_id)
      .eq("listing_id", listing_id)
      .single();

    let chatId = chat?.id;

    if (!chatId) {
      const { data: newChat, error: chatError } = await supabase
        .from("chats")
        .insert({
          buyer_id,
          seller_id,
          listing_id
        })
        .select()
        .single();
        
      if (chatError) throw chatError;
      chatId = newChat.id;
    }

    const encryptedMsg = encrypt(initial_message);
    
    const { error: msgError } = await supabase
      .from("messages")
      .insert({
        chat_id: chatId,
        sender_id: buyer_id,
        message_text: encryptedMsg,
        is_read: false
      });
      
    if (msgError) throw msgError;

    // Update chat updated_at
    await supabase.from("chats").update({ updated_at: new Date().toISOString() }).eq("id", chatId);

    res.status(200).json({ chat_id: chatId });
  } catch (error) {
    console.error("Chats POST error:", error);
    next(error);
  }
});

chatsRouter.get("/api/v1/chats", requireAuth, async (req, res, next): Promise<void> => {
  try {
    const userId = (req as any).user.id;
    const supabase = createSupabaseServiceClient();
    
    if (!supabase) {
      res.status(500).json({ error: "Supabase client not configured" });
      return;
    }

    // Fetch chats where user is buyer or seller
    const { data: chats, error: chatsError } = await supabase
      .from("chats")
      .select(`
        *,
        listing:listings(title, price_label),
        buyer:profiles!buyer_id(id, email, trust_score),
        seller:profiles!seller_id(id, email, trust_score)
      `)
      .or(`buyer_id.eq.${userId},seller_id.eq.${userId}`)
      .order('updated_at', { ascending: false });

    if (chatsError) throw chatsError;

    // Fetch latest message for each chat
    const populatedChats = await Promise.all((chats || []).map(async (chat) => {
      const { data: messages } = await supabase
        .from("messages")
        .select("*")
        .eq("chat_id", chat.id)
        .order("created_at", { ascending: false })
        .limit(1);

      const decryptedMessages = (messages || []).map(msg => ({
        ...msg,
        message_text: decrypt(msg.message_text)
      }));

      return {
        ...chat,
        messages: decryptedMessages
      };
    }));

    res.status(200).json({ items: populatedChats });
  } catch (error) {
    next(error);
  }
});

chatsRouter.get("/api/v1/chats/:id", requireAuth, async (req, res, next): Promise<void> => {
  try {
    const userId = (req as any).user.id;
    const chatId = req.params.id;
    const supabase = createSupabaseServiceClient();

    if (!supabase) {
      res.status(500).json({ error: "Supabase client not configured" });
      return;
    }

    const { data: chat, error: chatError } = await supabase
      .from("chats")
      .select(`
        *,
        listing:listings(title, price_label),
        buyer:profiles!buyer_id(id, email, trust_score),
        seller:profiles!seller_id(id, email, trust_score)
      `)
      .eq("id", chatId)
      .single();

    if (chatError || !chat) {
      res.status(404).json({ error: "Chat not found" });
      return;
    }

    if (chat.buyer_id !== userId && chat.seller_id !== userId) {
      res.status(403).json({ error: "Access denied" });
      return;
    }

    const { data: messages, error: messagesError } = await supabase
      .from("messages")
      .select("*")
      .eq("chat_id", chatId)
      .order("created_at", { ascending: true });
      
    if (messagesError) throw messagesError;

    const decryptedMessages = (messages || []).map(msg => ({
      ...msg,
      message_text: decrypt(msg.message_text)
    }));

    res.status(200).json({
      ...chat,
      messages: decryptedMessages
    });
  } catch (error) {
    next(error);
  }
});
