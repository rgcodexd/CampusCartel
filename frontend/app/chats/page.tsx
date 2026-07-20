"use client";

import { useEffect, useState } from "react";
import { createBrowserClient } from "@supabase/ssr";
import Link from "next/link";
import { MessageSquare, Clock } from "lucide-react";
import { useRouter } from "next/navigation";

export default function ChatsPage() {
  const [chats, setChats] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const [session, setSession] = useState<any>(null);

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  useEffect(() => {
    const init = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setSession(session);
      if (!session) {
        router.push("/login");
        return;
      }
      
      const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:4000"}/api/v1/chats`, {
        headers: {
          "Authorization": `Bearer ${session.access_token}`
        }
      });
      
      if (res.ok) {
        const data = await res.json();
        setChats(data.items || []);
      }
      setLoading(false);
    };
    
    init();
  }, [router, supabase]);

  if (loading) return <div className="p-10 text-center font-bold">Loading chats...</div>;

  return (
    <div className="max-w-4xl mx-auto p-4 md:p-8 animate-in fade-in duration-500">
      <h1 className="text-3xl font-black mb-6">My Chats</h1>
      
      {chats.length === 0 ? (
        <div className="text-center p-12 bg-zinc-50 dark:bg-zinc-900 rounded-3xl border border-dashed border-zinc-300 dark:border-zinc-700">
          <MessageSquare className="h-12 w-12 mx-auto text-zinc-300 dark:text-zinc-600 mb-4" />
          <p className="text-zinc-500 font-medium text-lg">No messages yet. Start a conversation on a listing!</p>
          <Link href="/browse" className="inline-block mt-4 px-6 py-3 bg-primary text-white rounded-full font-bold hover:scale-105 transition-all shadow-lg">
            Browse Listings
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {chats.map(chat => {
            const isBuyer = session?.user?.id === chat.buyer_id;
            const otherUser = isBuyer ? chat.seller : chat.buyer;
            const lastMessage = chat.messages?.[chat.messages.length - 1];
            
            return (
              <Link key={chat.id} href={`/chats/${chat.id}`} className="block group">
                <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-5 rounded-3xl group-hover:border-primary transition-all shadow-sm group-hover:shadow-md flex items-center gap-5">
                  <div className="h-14 w-14 bg-primary/10 text-primary rounded-full flex items-center justify-center font-black text-2xl uppercase shrink-0">
                    {otherUser?.email?.[0]}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-baseline mb-1">
                      <h3 className="font-bold text-lg truncate pr-4">{otherUser?.email?.split('@')[0] || "Unknown"}</h3>
                      {lastMessage && (
                        <span className="text-xs text-zinc-500 flex items-center gap-1 shrink-0 font-medium">
                          <Clock className="h-3.5 w-3.5" />
                          {new Date(lastMessage.created_at).toLocaleDateString()}
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-primary font-bold mb-1.5 truncate">{chat.listing?.title}</p>
                    <p className="text-sm text-zinc-600 dark:text-zinc-400 truncate font-medium">
                      {lastMessage ? (
                        <>
                          <span className={lastMessage.sender_id === session?.user?.id ? 'text-zinc-400' : 'text-zinc-800 dark:text-zinc-200'}>
                            {lastMessage.sender_id === session?.user?.id ? 'You: ' : ''}
                          </span>
                          {lastMessage.message_text}
                        </>
                      ) : (
                        <span className="italic opacity-50">No messages yet</span>
                      )}
                    </p>
                  </div>
                </div>
              </Link>
            )
          })}
        </div>
      )}
    </div>
  );
}
