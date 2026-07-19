"use client";

import { useState } from "react";
import { Send, Phone, MoreVertical, ArrowLeft, Image as ImageIcon, Smile, ChevronLeft } from "lucide-react";
import Link from "next/link";

/* Mock chat data */
const contacts = [
  { id: "1", name: "Rahul Sharma", avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=80&h=80", lastMsg: "Hey! Is this available for rent?", time: "11:30 AM", unread: 2, online: true },
  { id: "2", name: "Ananya Verma", avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=80&h=80", lastMsg: "iPhone 12", time: "10:30 AM", unread: 0, online: false },
  { id: "3", name: "Karan Singh", avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=80&h=80", lastMsg: "Study Table", time: "9:15 AM", unread: 0, online: true },
  { id: "4", name: "Priya Patel", avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&q=80&w=80&h=80", lastMsg: "Physics Textbook Set", time: "Yesterday", unread: 1, online: false },
  { id: "5", name: "Rohit Yadav", avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=80&h=80", lastMsg: "Royal Enfield 350", time: "Yesterday", unread: 0, online: false },
];

const messages = [
  { id: 1, sender: "them", text: "Hey! Is this available for rent?", time: "11:30 AM" },
  { id: 2, sender: "me", text: "Yes, it is! We can meet at the library.", time: "11:32 AM" },
  { id: 3, sender: "them", text: "Perfect! What time works for you?", time: "11:33 AM" },
  { id: 4, sender: "me", text: "How about 4 PM today?", time: "11:35 AM" },
  { id: 5, sender: "them", text: "Sure, I'll be there at 4 PM.", time: "11:36 AM" },
  { id: 6, sender: "me", text: "Great, see you! 👋", time: "11:37 AM" },
];

export default function ChatsPage() {
  const [selectedChat, setSelectedChat] = useState(contacts[0]);
  const [messageInput, setMessageInput] = useState("");
  const [showSidebar, setShowSidebar] = useState(true);

  return (
    <main className="mx-auto max-w-7xl px-4 pb-0 pt-4 md:px-8">
      <div className="flex h-[calc(100vh-80px)] bg-white dark:bg-surface rounded-2xl border overflow-hidden">
        {/* ── Contact List ── */}
        <div className={`w-full md:w-80 flex-shrink-0 border-r flex flex-col ${!showSidebar ? "hidden md:flex" : "flex"}`}>
          <div className="p-4 border-b">
            <h2 className="font-[var(--font-heading)] text-lg font-bold text-foreground">My Chats</h2>
          </div>
          <div className="flex-1 overflow-y-auto">
            {contacts.map((c) => (
              <button
                key={c.id}
                onClick={() => { setSelectedChat(c); setShowSidebar(false); }}
                className={`w-full flex items-center gap-3 p-4 hover:bg-muted/50 transition border-b text-left ${
                  selectedChat.id === c.id ? "bg-primary/5" : ""
                }`}
              >
                <div className="relative flex-shrink-0">
                  <img src={c.avatar} alt={c.name} className="w-10 h-10 rounded-full object-cover" />
                  {c.online && <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-green-500 border-2 border-white dark:border-surface" />}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-baseline">
                    <span className="font-semibold text-sm text-foreground truncate">{c.name}</span>
                    <span className="text-[10px] text-muted-foreground flex-shrink-0 ml-2">{c.time}</span>
                  </div>
                  <p className="text-xs text-muted-foreground truncate mt-0.5">{c.lastMsg}</p>
                </div>
                {c.unread > 0 && (
                  <span className="bg-primary text-white text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0">
                    {c.unread}
                  </span>
                )}
              </button>
            ))}
          </div>
          <Link href="/" className="flex items-center gap-2 p-4 border-t text-sm text-red-500 font-medium hover:bg-red-500/5 transition">
            ← Back to Home
          </Link>
        </div>

        {/* ── Chat Window ── */}
        <div className={`flex-1 flex flex-col ${showSidebar ? "hidden md:flex" : "flex"}`}>
          {/* Chat Header */}
          <div className="flex items-center justify-between p-4 border-b">
            <div className="flex items-center gap-3">
              <button onClick={() => setShowSidebar(true)} className="md:hidden p-1">
                <ChevronLeft className="h-5 w-5 text-muted-foreground" />
              </button>
              <img src={selectedChat.avatar} alt={selectedChat.name} className="w-9 h-9 rounded-full object-cover" />
              <div>
                <h3 className="font-semibold text-sm text-foreground">{selectedChat.name}</h3>
                <span className={`text-[10px] ${selectedChat.online ? "text-green-500" : "text-muted-foreground"}`}>
                  {selectedChat.online ? "● Active now" : "Offline"}
                </span>
              </div>
            </div>
            {/* Product context pill */}
            <div className="hidden sm:flex items-center gap-2 bg-muted rounded-xl px-3 py-2 border">
              <img src="https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/macbook-air-midnight-select-20220606?wid=60&fmt=webp" alt="" className="h-8 w-8 object-contain" />
              <div>
                <p className="text-xs font-semibold text-foreground">MacBook Air M1</p>
                <p className="text-[10px] text-muted-foreground">₹499 / day</p>
              </div>
              <Link href="/browse/1" className="text-[10px] text-primary font-semibold hover:underline ml-2">View Listing</Link>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {messages.map((msg) => (
              <div key={msg.id} className={`flex ${msg.sender === "me" ? "justify-end" : "justify-start"}`}>
                <div className={`max-w-[70%] px-4 py-2.5 rounded-2xl text-sm ${
                  msg.sender === "me"
                    ? "bg-primary text-white rounded-br-sm"
                    : "bg-muted text-foreground rounded-bl-sm"
                }`}>
                  <p>{msg.text}</p>
                  <div className={`text-[9px] mt-1 text-right ${msg.sender === "me" ? "text-white/60" : "text-muted-foreground"}`}>
                    {msg.time}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Input */}
          <div className="p-4 border-t">
            <div className="flex items-center gap-2">
              <button className="p-2 rounded-full hover:bg-muted transition text-muted-foreground"><Smile className="h-5 w-5" /></button>
              <button className="p-2 rounded-full hover:bg-muted transition text-muted-foreground"><ImageIcon className="h-5 w-5" /></button>
              <input
                type="text"
                value={messageInput}
                onChange={(e) => setMessageInput(e.target.value)}
                placeholder="Type a message..."
                className="flex-1 bg-muted rounded-full px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40"
              />
              <button className="p-2.5 rounded-full bg-primary text-white hover:bg-primary/90 transition shadow-sm">
                <Send className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
