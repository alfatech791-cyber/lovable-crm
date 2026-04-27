 import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
 import { Sparkles, Mail, Lock, ArrowRight, MessageSquare, Users, Zap } from "lucide-react";
 import { useState } from "react";

export const Route = createFileRoute("/login")({
  head: () => ({
    meta: [
      { title: "Entrar — ConectaCRM" },
      { name: "description", content: "Acesse sua conta ConectaCRM." },
    ],
  }),
  component: Login,
});

 function Login() {
   const navigate = useNavigate();
   const [loading, setLoading] = useState(false);
 
   const handle = (e: React.FormEvent) => {
     e.preventDefault();
     setLoading(true);
     setTimeout(() => navigate({ to: "/" }), 600);
   };
 
   return (
     <div className="min-h-screen grid lg:grid-cols-2 bg-background">
       {/* Left side */}
       <div className="flex flex-col justify-center px-6 sm:px-12 lg:px-20 py-12">
         <Link to="/" className="flex items-center gap-2.5 mb-12">
           <div className="h-10 w-10 rounded-xl bg-gradient-primary grid place-items-center shadow-glow">
             <Sparkles className="h-5 w-5 text-white" strokeWidth={2.5} />
           </div>
           <span className="font-display font-bold text-xl tracking-tight">ConectaCRM</span>
         </Link>
 
         <div className="max-w-sm w-full">
           <h1 className="text-3xl font-bold font-display tracking-tight">Bem-vindo de volta 👋</h1>
           <p className="text-sm text-muted-foreground mt-2">
             Entre na sua conta para continuar gerenciando seus leads.
           </p>
 
           <form onSubmit={handle} className="mt-8 space-y-4">
             <div>
               <label className="text-[12.5px] font-medium text-foreground/80">E-mail</label>
               <div className="relative mt-1.5">
                 <Mail className="h-4 w-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
                 <input type="email" defaultValue="renato@conectacrm.com" className="w-full h-11 pl-10 pr-3 rounded-xl bg-muted/50 border border-border focus:bg-card focus:border-ring outline-none text-sm transition" />
               </div>
             </div>
             <div>
               <div className="flex items-center justify-between">
                 <label className="text-[12.5px] font-medium text-foreground/80">Senha</label>
                 <a className="text-[11.5px] text-primary hover:text-primary-glow font-medium cursor-pointer">Esqueci a senha</a>
               </div>
               <div className="relative mt-1.5">
                 <Lock className="h-4 w-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
                 <input type="password" defaultValue="demo1234" className="w-full h-11 pl-10 pr-3 rounded-xl bg-muted/50 border border-border focus:bg-card focus:border-ring outline-none text-sm transition" />
               </div>
             </div>
 
             <label className="flex items-center gap-2 text-[12.5px] text-foreground/80">
               <input type="checkbox" className="h-4 w-4 rounded border-border accent-primary" defaultChecked />
               Manter-me conectado
             </label>
 
             <button type="submit" disabled={loading} className="w-full h-11 rounded-xl bg-gradient-primary text-primary-foreground font-medium text-sm shadow-elegant hover:opacity-95 inline-flex items-center justify-center gap-2 transition disabled:opacity-70">
               {loading ? "Entrando..." : <>Entrar <ArrowRight className="h-4 w-4" /></>}
             </button>
           </form>
 
           <div className="mt-6 text-center text-[12.5px] text-muted-foreground">
             Não tem uma conta? <a className="text-primary font-semibold hover:text-primary-glow cursor-pointer">Criar conta grátis</a>
           </div>
 
           <p className="mt-8 text-[11px] text-muted-foreground text-center">
             🔒 Auth real será ativado quando você habilitar o Lovable Cloud.
           </p>
         </div>
       </div>
 
       {/* Right side — branded panel */}
       <div className="hidden lg:flex relative overflow-hidden bg-sidebar text-white">
         <div className="absolute inset-0 bg-gradient-primary opacity-90" />
         <div className="absolute -top-24 -right-24 h-96 w-96 rounded-full bg-white/10 blur-3xl" />
         <div className="absolute -bottom-24 -left-24 h-96 w-96 rounded-full bg-white/10 blur-3xl" />
 
         <div className="relative z-10 flex flex-col justify-between p-12 w-full">
           <div className="inline-flex items-center gap-2 self-start text-xs font-semibold bg-white/15 backdrop-blur-sm rounded-full px-3 py-1.5">
             <Sparkles className="h-3.5 w-3.5" /> Novo: IA Conecta disponível
           </div>
 
           <div className="space-y-6 max-w-md">
             <h2 className="text-4xl font-bold font-display tracking-tight leading-[1.1]">
               Centralize WhatsApp, Instagram e seu funil em um só lugar.
             </h2>
             <p className="text-white/80 text-base leading-relaxed">
               Mais de 12 mil empresas usam o ConectaCRM para responder rápido,
               vender mais e nunca perder um lead.
             </p>
 
             <div className="grid grid-cols-3 gap-3">
               {[
                 { icon: MessageSquare, label: "Inbox unificado" },
                 { icon: Users, label: "Funil visual" },
                 { icon: Zap, label: "Automações" },
               ].map((f) => {
                 const Icon = f.icon;
                 return (
                   <div key={f.label} className="rounded-xl bg-white/10 backdrop-blur-sm border border-white/15 p-3">
                     <Icon className="h-5 w-5 mb-2" />
                     <div className="text-xs font-semibold leading-tight">{f.label}</div>
                   </div>
                 );
               })}
             </div>
           </div>
 
           <div className="flex items-center gap-3 text-sm text-white/85">
             <div className="flex -space-x-2">
               {["JM","CE","BC","RS"].map((i, k) => (
                 <div key={k} className="h-8 w-8 rounded-full bg-white/20 border-2 border-white/40 grid place-items-center text-[10px] font-bold">{i}</div>
               ))}
             </div>
             <span>+ 12.000 empresas confiam no ConectaCRM</span>
           </div>
         </div>
       </div>
     </div>
   );
 }
