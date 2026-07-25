import { Server, Socket } from "socket.io";
import { getDb } from "../config/firebase.js";
import { encrypt } from "../utils/encryption.js";
import { createSupabaseServiceClient } from "../config/supabase.js";
import { randomUUID } from "crypto";

export function registerChatHandlers(io: Server) {
  io.use(async (socket, next) => {
    const token = socket.handshake.auth.token;
    if (!token) {
      return next(new Error("Authentication error: No token provided"));
    }
    
    const supabase = createSupabaseServiceClient();
    if (!supabase) {
      return next(new Error("Supabase client not configured"));
    }

    const { data: { user }, error } = await supabase.auth.getUser(token);
    
    if (error || !user) {
      return next(new Error("Authentication error: Invalid token"));
    }
    
    (socket as any).userId = user.id;
    next();
  });

  io.on("connection", (socket: Socket) => {
    const userId = (socket as any).userId;
    console.log(`User connected to chat socket: ${userId}`);

    socket.on("join_chat", async (chatId: string) => {
      try {
        const chatDoc = await getDb().collection("chats").doc(chatId).get();
        if (chatDoc.exists) {
          const chatData = chatDoc.data();
          if (chatData && (chatData.buyer_id === userId || chatData.seller_id === userId)) {
            socket.join(chatId);
            console.log(`User ${userId} joined chat ${chatId}`);
          }
        }
      } catch (err) {
        console.error("Error joining chat room", err);
      }
    });

    socket.on("send_message", async (data: { chat_id: string; message_text: string }) => {
      const { chat_id, message_text } = data;
      if (!chat_id || !message_text) return;

      try {
        const chatDoc = await getDb().collection("chats").doc(chat_id).get();
        if (!chatDoc.exists) return;
        const chatData = chatDoc.data();
        if (!chatData || (chatData.buyer_id !== userId && chatData.seller_id !== userId)) return;

        const messageId = randomUUID();
        const encryptedMsg = encrypt(message_text);
        const createdAt = new Date().toISOString();

        const msgData = {
          id: messageId,
          chat_id,
          sender_id: userId,
          message_text: encryptedMsg, 
          is_read: false,
          created_at: createdAt
        };

        await getDb().collection("chats").doc(chat_id).collection("messages").doc(messageId).set(msgData);

        await getDb().collection("chats").doc(chat_id).update({
          updated_at: createdAt
        });

        const msgToEmit = {
          ...msgData,
          message_text: message_text 
        };

        io.to(chat_id).emit("new_message", msgToEmit);

      } catch (err) {
        console.error("Error sending message", err);
      }
    });

    socket.on("disconnect", () => {
      console.log(`User disconnected from socket: ${userId}`);
    });
  });
}
