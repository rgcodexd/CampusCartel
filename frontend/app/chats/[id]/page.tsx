"use client";

import { useEffect, useState, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { Send, ArrowLeft } from "lucide-react";
import Link from "next/link";
import RatingModal from "@/components/RatingModal";
import io, { Socket } from "socket.io-client";

export default function ChatDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [session, setSession] = useState<any>(null);
  const [chat, setChat] = useState<any>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [isRatingOpen, setIsRatingOpen] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const socketRef = useRef<Socket | null>(null);
  


  useEffect(() => {
    let currentSocket: Socket | null = null;

    const init = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setSession(session);
      if (!session) {
        router.push("/login");
        return;
      }

      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000"}/api/v1/chats/${params.id}`, {
          headers: {
            "Authorization": `Bearer ${session.access_token}`
          }
        });

        if (res.ok) {
          const chatData = await res.json();
          setChat(chatData);
          setMessages(chatData.messages || []);
        } else {
          setChat(null);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }

      currentSocket = io(process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000", {
        auth: { token: session.access_token }
      });

      socketRef.current = currentSocket;

      currentSocket.on("connect", () => {
        currentSocket?.emit("join_chat", params.id);
      });

      currentSocket.on("new_message", (msg) => {
        setMessages(prev => {
          if (prev.some(m => m.id === msg.id)) return prev;
          return [...prev, msg];
        });
      });
    };

    init();

    return () => {
      if (currentSocket) {
        currentSocket.disconnect();
      }
    };
  }, [params.id, supabase, router]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !session || !socketRef.current) return;

    const msg = newMessage;
    setNewMessage("");

    socketRef.current.emit("send_message", {
      chat_id: params.id,
      message_text: msg
    });
  };

  if (loading) return <div className="p-10 text-center font-bold">Loading...</div>;
  if (!chat) return <div className="p-10 text-center text-red-500 font-bold">Chat not found</div>;

  const isBuyer = session?.user?.id === chat.buyer_id;
  const otherUser = isBuyer ? chat.seller : chat.buyer;

  return (
    <div className="max-w-4xl mx-auto h-[calc(100vh-80px)] flex flex-col bg-white dark:bg-zinc-950 border-x border-zinc-200 dark:border-zinc-800 animate-in fade-in duration-500">
      <div className="flex items-center justify-between p-4 border-b border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900">
        <div className="flex items-center gap-4">
          <Link href="/chats" className="p-2 bg-zinc-200 dark:bg-zinc-800 rounded-full hover:bg-zinc-300 dark:hover:bg-zinc-700 transition-colors">
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <div>
            <h2 className="font-bold text-lg leading-tight">{otherUser?.email?.split('@')[0] || "Unknown"}</h2>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 font-medium">Trust: ★ {otherUser?.trust_score}</p>
          </div>
        </div>
        <div className="text-right">
          <h3 className="font-bold text-primary">{chat.listing?.title}</h3>
          <button 
            onClick={() => setIsRatingOpen(true)}
            className="text-xs bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-500 px-3 py-1 rounded-full font-bold hover:bg-yellow-200 dark:hover:bg-yellow-900/50 transition-colors"
          >
            Rate User
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg) => {
          const isMine = msg.sender_id === session?.user?.id;
          return (
            <div key={msg.id} className={`flex ${isMine ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[70%] p-4 rounded-3xl ${isMine ? 'bg-primary text-white rounded-br-sm' : 'bg-zinc-100 dark:bg-zinc-900 text-foreground rounded-bl-sm border border-zinc-200 dark:border-zinc-800'}`}>
                <p className="text-sm font-medium leading-relaxed">{msg.message_text}</p>
                <p className={`text-[10px] mt-1 text-right ${isMine ? 'text-white/70' : 'text-zinc-500'}`}>
                  {new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </p>
              </div>
            </div>
          )
        })}
        <div ref={messagesEndRef} />
      </div>

      <form onSubmit={handleSendMessage} className="p-4 bg-zinc-50 dark:bg-zinc-900 border-t border-zinc-200 dark:border-zinc-800 flex gap-2">
        <input 
          type="text" 
          value={newMessage}
          onChange={e => setNewMessage(e.target.value)}
          placeholder="Type a message..."
          className="flex-1 bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-700 rounded-full px-5 outline-none focus:border-primary transition-colors text-sm font-medium"
        />
        <button type="submit" disabled={!newMessage.trim()} className="bg-primary text-white p-3.5 rounded-full hover:scale-105 transition-all disabled:opacity-50 disabled:scale-100">
          <Send className="h-5 w-5" />
        </button>
      </form>

      {isRatingOpen && (
        <RatingModal 
          isOpen={isRatingOpen}
          onClose={() => setIsRatingOpen(false)}
          listingId={chat.listing_id}
          revieweeId={otherUser.id}
        />
      )}
    </div>
  );
}
