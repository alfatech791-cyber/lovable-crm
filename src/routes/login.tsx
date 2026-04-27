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
 
       {/* Right side — branded panel with image */}
       <div className="hidden lg:flex relative overflow-hidden bg-[#F8F9FC] p-8">
         <div className="relative w-full h-full rounded-[24px] overflow-hidden shadow-2xl border border-white/20">
           <img 
             src="https://cvbgrjauqjawrsyknhyj.supabase.co/storage/v1/object/public/files/uploads/d16nTzdSTqQPXL29dCvm2A8Zeql1/1777331682200-abhrt-ChatGPT_Image_27_de_abr._de_2026__16_50_081.png" 
             alt="ConectaCRM Dashboard"
             className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 hover:scale-105"
           />
           <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />
           
           <div className="absolute bottom-0 left-0 right-0 p-10 text-white">
             <div className="space-y-4 max-w-sm">
               <div className="inline-flex items-center gap-2 text-xs font-bold bg-white/20 backdrop-blur-md rounded-full px-4 py-2 border border-white/30 uppercase tracking-wider">
                 <Sparkles className="h-4 w-4 text-yellow-400" /> Novas Funcionalidades
               </div>
               <h2 className="text-3xl font-bold font-display tracking-tight leading-tight">
                 A plataforma que escala seu negócio.
               </h2>
               <p className="text-white/90 text-sm leading-relaxed font-medium">
                 Gestão completa de leads, vendas e automações com a melhor experiência visual do mercado.
               </p>
             </div>
           </div>
         </div>
       </div>
     </div>
   );
 }
