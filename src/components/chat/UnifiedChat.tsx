import { useState } from "react";
import { MessageSquare, Instagram, Search, Filter, MoreHorizontal, Send, Paperclip, Smile, Phone, Video, Info } from "lucide-react";
import { AppSidebar } from "@/components/layout/Sidebar";

const channels = [
  { id: "all", label: "Todas", count: 24 },
  { id: "whatsapp", label: "WhatsApp", count: 14 },
  { id: "instagram", label: "Instagram", count: 10 },
];

const mockChats = [
  { id: 1, name: "João Silva", lastMsg: "Quero saber o preço do iPhone 15", time: "10:30", channel: "whatsapp", unread: 2, avatar: "JS" },
  { id: 2, name: "Maria Oliveira", lastMsg: "Vocês aceitam troca?", time: "09:15", channel: "instagram", unread: 0, avatar: "MO" },
  { id: 3, name: "Pedro Santos", lastMsg: "Obrigado pela atenção!", time: "Ontem", channel: "whatsapp", unread: 0, avatar: "PS" },
];

export function UnifiedChat() {
  const [selectedChat, setSelectedChat] = useState<number | null>(1);
  const [activeChannel, setActiveChannel] = useState("all");

  return (
    <div className="flex h-screen w-full bg-background overflow-hidden">
      <AppSidebar />
      
      {/* Chat List */}
      <div className="w-[380px] border-r border-border flex flex-col bg-card/50">
        <div className="p-4 border-b border-border space-y-4">
          <div className="flex items-center justify-between">
            <h1 className="text-xl font-bold font-display">Atendimento</h1>
            <button className="p-2 hover:bg-muted rounded-lg transition"><Filter className="h-5 w-5 text-muted-foreground" /></button>
          </div>
          <div className="relative">
            <Search className="h-4 w-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input 
              placeholder="Buscar conversas..." 
              className="w-full h-10 pl-10 pr-4 rounded-xl bg-muted/50 border-none focus:ring-2 focus:ring-primary/20 text-sm"
            />
          </div>
          <div className="flex gap-1">
            {channels.map(c => (
              <button 
                key={c.id}
                onClick={() => setActiveChannel(c.id)}
                className={`flex-1 py-2 text-xs font-bold rounded-lg transition ${activeChannel === c.id ? "bg-primary text-white" : "bg-muted text-muted-foreground hover:bg-muted/80"}`}
              >
                {c.label}
              </button>
            ))}
          </div>
        </div>

        <div className="flex-1 overflow-y-auto custom-scrollbar">
          {mockChats.map(chat => (
            <button 
              key={chat.id}
              onClick={() => setSelectedChat(chat.id)}
              className={`w-full flex items-start gap-3 p-4 border-b border-border/50 transition relative ${selectedChat === chat.id ? "bg-primary/5" : "hover:bg-muted/30"}`}
            >
              {selectedChat === chat.id && <div className="absolute left-0 top-0 bottom-0 w-1 bg-primary" />}
              <div className="relative shrink-0">
                <div className="h-12 w-12 rounded-full bg-gradient-primary grid place-items-center text-white font-bold">
                  {chat.avatar}
                </div>
                <div className={`absolute -bottom-1 -right-1 h-5 w-5 rounded-full border-2 border-card grid place-items-center ${chat.channel === "whatsapp" ? "bg-success" : "bg-pink-500"}`}>
                  {chat.channel === "whatsapp" ? <MessageSquare className="h-2.5 w-2.5 text-white" /> : <Instagram className="h-2.5 w-2.5 text-white" />}
                </div>
              </div>
              <div className="flex-1 min-w-0 text-left">
                <div className="flex items-center justify-between mb-0.5">
                  <span className="font-bold text-sm truncate">{chat.name}</span>
                  <span className="text-[10px] text-muted-foreground">{chat.time}</span>
                </div>
                <p className="text-xs text-muted-foreground truncate">{chat.lastMsg}</p>
              </div>
              {chat.unread > 0 && (
                <div className="h-5 min-w-[20px] px-1 rounded-full bg-primary grid place-items-center text-[10px] font-bold text-white mt-1">
                  {chat.unread}
                </div>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Chat Area */}
      {selectedChat ? (
        <div className="flex-1 flex flex-col relative bg-card/20">
          {/* Header */}
          <div className="h-[68px] px-6 border-b border-border flex items-center justify-between bg-card">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-muted grid place-items-center font-bold text-sm">JS</div>
              <div>
                <h2 className="font-bold text-sm">João Silva</h2>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <span className="h-1.5 w-1.5 rounded-full bg-success animate-pulse" />
                  <span className="text-[10px] font-medium text-muted-foreground uppercase">Online</span>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button className="h-9 w-9 grid place-items-center rounded-lg hover:bg-muted transition text-muted-foreground"><Phone className="h-4.5 w-4.5" /></button>
              <button className="h-9 w-9 grid place-items-center rounded-lg hover:bg-muted transition text-muted-foreground"><Video className="h-4.5 w-4.5" /></button>
              <div className="w-[1px] h-6 bg-border mx-1" />
              <button className="h-9 w-9 grid place-items-center rounded-lg hover:bg-muted transition text-muted-foreground"><Info className="h-4.5 w-4.5" /></button>
              <button className="h-9 w-9 grid place-items-center rounded-lg hover:bg-muted transition text-muted-foreground"><MoreHorizontal className="h-4.5 w-4.5" /></button>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 p-6 overflow-y-auto space-y-6">
            <div className="flex justify-center">
              <span className="px-3 py-1 rounded-full bg-muted text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Hoje</span>
            </div>
            
            <div className="flex flex-col items-start max-w-[70%]">
              <div className="bg-muted px-4 py-3 rounded-2xl rounded-tl-none text-sm leading-relaxed shadow-sm">
                Olá! Vi um anúncio do iPhone 15 Pro Max de 256GB. Vocês ainda têm em estoque?
              </div>
              <span className="text-[10px] text-muted-foreground mt-1.5 ml-1">10:30</span>
            </div>

            <div className="flex flex-col items-end max-w-[70%] ml-auto">
              <div className="bg-primary text-white px-4 py-3 rounded-2xl rounded-tr-none text-sm leading-relaxed shadow-elegant">
                Olá, João! Tudo bem? Temos sim! 🎉 Inclusive na cor Natural Titanium que é a mais procurada. Quer que eu reserve um para você?
              </div>
              <span className="text-[10px] text-muted-foreground mt-1.5 mr-1">10:32 • Visualizada</span>
            </div>
          </div>

          {/* Input */}
          <div className="p-4 bg-card border-t border-border">
            <div className="max-w-4xl mx-auto flex items-end gap-3">
              <div className="flex-1 bg-muted/50 rounded-2xl border border-border p-2 focus-within:border-primary/50 transition">
                <textarea 
                  placeholder="Digite sua mensagem..." 
                  className="w-full bg-transparent border-none focus:ring-0 text-sm min-h-[44px] max-h-32 resize-none py-2 px-3"
                  rows={1}
                />
                <div className="flex items-center justify-between px-2 pb-1">
                  <div className="flex items-center gap-1">
                    <button className="p-2 hover:bg-muted rounded-lg text-muted-foreground transition"><Smile className="h-5 w-5" /></button>
                    <button className="p-2 hover:bg-muted rounded-lg text-muted-foreground transition"><Paperclip className="h-5 w-5" /></button>
                  </div>
                  <div className="text-[10px] text-muted-foreground font-medium italic">Shift + Enter para pular linha</div>
                </div>
              </div>
              <button className="h-[44px] w-[44px] shrink-0 rounded-xl bg-gradient-primary text-white shadow-elegant grid place-items-center hover:opacity-90 transition">
                <Send className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="flex-1 grid place-items-center bg-muted/10">
          <div className="text-center space-y-4 max-w-sm px-6">
            <div className="h-20 w-20 rounded-3xl bg-card border border-border shadow-card mx-auto grid place-items-center text-primary/30">
              <MessageSquare className="h-10 w-10" />
            </div>
            <h3 className="text-xl font-bold font-display">Selecione uma conversa</h3>
            <p className="text-sm text-muted-foreground">Escolha um atendimento na lista ao lado para começar a conversar com seu cliente em tempo real.</p>
          </div>
        </div>
      )}
    </div>
  );
}