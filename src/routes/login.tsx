 import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
 import { Sparkles, Mail, Lock, ArrowRight } from "lucide-react";
 import { useState } from "react";
 import { supabase } from "@/integrations/supabase/client";
import { NetworkBackground } from "@/components/ui/network-background";

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
   const [email, setEmail] = useState("renato@conectacrm.com");
   const [password, setPassword] = useState("demo1234");
   const [error, setError] = useState("");
 
   const handle = async (e: React.FormEvent) => {
     e.preventDefault();
      setError("");
     setLoading(true);

      const { error: signInError } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      });

      if (signInError) {
        setError(signInError.message);
        setLoading(false);
        return;
      }

      navigate({ to: "/funil" });
   };
 
   return (
    <div className="min-h-screen grid lg:grid-cols-2 bg-black overflow-hidden relative">
      <NetworkBackground />
       {/* Left side */}
      <div className="flex flex-col justify-center px-6 sm:px-12 lg:px-20 py-12 relative z-10 bg-black/40 backdrop-blur-sm">
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
                  <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full h-11 pl-10 pr-3 rounded-xl bg-muted/50 border border-border focus:bg-card focus:border-ring outline-none text-sm transition" />
               </div>
             </div>
             <div>
               <div className="flex items-center justify-between">
                 <label className="text-[12.5px] font-medium text-foreground/80">Senha</label>
                 <a className="text-[11.5px] text-primary hover:text-primary-glow font-medium cursor-pointer">Esqueci a senha</a>
               </div>
               <div className="relative mt-1.5">
                 <Lock className="h-4 w-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
                  <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full h-11 pl-10 pr-3 rounded-xl bg-muted/50 border border-border focus:bg-card focus:border-ring outline-none text-sm transition" />
               </div>
             </div>

              {error && (
                <div className="rounded-xl border border-destructive/20 bg-destructive/5 px-3 py-2 text-xs text-destructive">
                  {error}
                </div>
              )}
 
             <label className="flex items-center gap-2 text-[12.5px] text-foreground/80">
               <input type="checkbox" className="h-4 w-4 rounded border-border accent-primary" defaultChecked />
               Manter-me conectado
             </label>
 
             <button type="submit" disabled={loading} className="w-full h-11 rounded-xl bg-gradient-primary text-primary-foreground font-medium text-sm shadow-elegant hover:opacity-95 inline-flex items-center justify-center gap-2 transition disabled:opacity-70">
               {loading ? "Entrando..." : <>Entrar <ArrowRight className="h-4 w-4" /></>}
             </button>
           </form>
 
            <div className="mt-6 text-center text-[12.5px] text-muted-foreground">
              Não tem uma conta? <Link to="/registro" className="text-primary font-semibold hover:text-primary-glow cursor-pointer">Criar conta grátis</Link>
            </div>
 
            <p className="mt-8 text-[11px] text-muted-foreground text-center">
              Entre com sua conta Supabase para liberar os dados protegidos do CRM.
            </p>
         </div>
       </div>
 
       {/* Right side — branded panel with image and new messaging */}
       <div className="hidden lg:flex relative overflow-hidden bg-[#0A0C10] p-10">
         {/* Animated background elements */}
         <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/20 rounded-full blur-[120px] -mr-64 -mt-64" />
         <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-primary/10 rounded-full blur-[120px] -ml-64 -mb-64" />
         
         <div className="relative z-10 w-full h-full flex flex-col">
           {/* Header Tag */}
           <div className="flex justify-between items-start mb-8">
             <div className="inline-flex items-center gap-2 bg-white/5 backdrop-blur-md border border-white/10 rounded-full px-4 py-2">
               <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
               <span className="text-[11px] font-bold text-white/80 uppercase tracking-widest">Plataforma Ativa</span>
             </div>
             <div className="flex -space-x-3">
               {[1, 2, 3, 4].map((i) => (
                 <div key={i} className="h-9 w-9 rounded-full border-2 border-[#0A0C10] bg-white/10 flex items-center justify-center overflow-hidden">
                   <img src={`https://i.pravatar.cc/100?img=${i+20}`} alt="User" className="w-full h-full object-cover" />
                 </div>
               ))}
               <div className="h-9 w-9 rounded-full border-2 border-[#0A0C10] bg-primary flex items-center justify-center text-[10px] font-bold text-white">
                 +12k
               </div>
             </div>
           </div>
 
           {/* Main Image Container with Perspective */}
           <div className="flex-1 relative group mt-4">
             <div className="absolute inset-0 bg-primary/20 blur-[80px] rounded-full scale-75 opacity-50 group-hover:opacity-100 transition-opacity duration-700" />
             <div className="relative h-full rounded-[32px] overflow-hidden border border-white/10 shadow-[0_0_80px_-15px_rgba(var(--primary),0.3)] bg-[#0F172A]">
               <img 
                 src="https://cvbgrjauqjawrsyknhyj.supabase.co/storage/v1/object/public/files/uploads/d16nTzdSTqQPXL29dCvm2A8Zeql1/1777331682200-abhrt-ChatGPT_Image_27_de_abr._de_2026__16_50_081.png" 
                 alt="ConectaCRM Dashboard"
                 className="w-full h-full object-cover object-top opacity-90 group-hover:scale-105 transition-transform duration-1000"
               />
               <div className="absolute inset-0 bg-gradient-to-t from-[#0A0C10] via-transparent to-transparent" />
             </div>
           </div>
 
           {/* Footer Text Content */}
           <div className="mt-10 space-y-4">
             <h2 className="text-4xl xl:text-5xl font-bold font-display text-white leading-[1.1] tracking-tight">
               Conecte seus leads, <br />
               <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-primary-glow">feche mais vendas.</span>
             </h2>
             <p className="text-white/60 text-lg max-w-lg leading-relaxed">
               Aumente sua produtividade com um ecossistema completo de gestão comercial e automações inteligentes.
             </p>
           </div>
         </div>
       </div>
     </div>
   );
 }
