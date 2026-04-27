 import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
 import { Sparkles, Mail, Lock, ArrowRight, MessageSquare, Users, Zap, CheckCircle2, Eye, EyeOff } from "lucide-react";
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
   const [showPassword, setShowPassword] = useState(false);
 
   const handle = (e: React.FormEvent) => {
     e.preventDefault();
     setLoading(true);
     setTimeout(() => navigate({ to: "/" }), 800);
   };
 
   return (
     <div className="min-h-screen flex items-center justify-center bg-[#F8F9FC] p-4 lg:p-8">
       <div className="w-full max-w-[1100px] grid lg:grid-cols-2 bg-white rounded-[32px] overflow-hidden shadow-[0_32px_64px_-12px_rgba(0,0,0,0.08)]">
         
         {/* Left Side: Illustration & Benefits */}
         <div className="hidden lg:flex flex-col bg-[#6366F1] text-white p-12 relative overflow-hidden">
           {/* Background Decorations */}
           <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-32 -mt-32 blur-3xl" />
           <div className="absolute bottom-0 left-0 w-64 h-64 bg-white/10 rounded-full -ml-32 -mb-32 blur-3xl" />
           
           <div className="relative z-10 flex flex-col h-full">
             <Link to="/" className="flex items-center gap-2.5 mb-16">
               <div className="h-9 w-9 rounded-lg bg-white/20 backdrop-blur-md flex items-center justify-center">
                 <Sparkles className="h-5 w-5 text-white" strokeWidth={2.5} />
               </div>
               <span className="font-display font-bold text-xl tracking-tight">ConectaCRM</span>
             </Link>
 
             <div className="mt-auto space-y-8">
               <div>
                 <h2 className="text-4xl font-bold font-display leading-[1.2] tracking-tight">
                   Otimize seu fluxo de trabalho em minutos.
                 </h2>
                 <p className="text-white/80 mt-4 text-lg max-w-md">
                   A plataforma completa para gerenciar leads, automações e vendas em um só lugar.
                 </p>
               </div>
 
               <div className="space-y-4">
                 {[
                   "Gestão de leads inteligente",
                   "Automação de processos",
                   "Dashboard em tempo real",
                   "Suporte especializado"
                 ].map((benefit) => (
                   <div key={benefit} className="flex items-center gap-3">
                     <div className="h-5 w-5 rounded-full bg-white/20 flex items-center justify-center shrink-0">
                       <CheckCircle2 className="h-3 w-3 text-white" />
                     </div>
                     <span className="text-sm font-medium text-white/90">{benefit}</span>
                   </div>
                 ))}
               </div>
 
               <div className="pt-8 border-t border-white/10 flex items-center gap-4">
                 <div className="flex -space-x-3">
                   {[1, 2, 3].map((i) => (
                     <div key={i} className="h-10 w-10 rounded-full border-2 border-[#6366F1] bg-white/10 overflow-hidden">
                       <img src={`https://i.pravatar.cc/100?img=${i+10}`} alt="User" />
                     </div>
                   ))}
                 </div>
                 <p className="text-xs text-white/70">
                   <span className="text-white font-bold">+12k</span> empresas confiam na nossa plataforma.
                 </p>
               </div>
             </div>
           </div>
         </div>
 
         {/* Right Side: Login Form */}
         <div className="flex flex-col justify-center p-8 lg:p-16">
           <div className="lg:hidden flex justify-center mb-8">
              <Link to="/" className="flex items-center gap-2.5">
               <div className="h-9 w-9 rounded-lg bg-primary flex items-center justify-center">
                 <Sparkles className="h-5 w-5 text-white" strokeWidth={2.5} />
               </div>
               <span className="font-display font-bold text-xl tracking-tight">ConectaCRM</span>
             </Link>
           </div>
 
           <div className="max-w-md mx-auto w-full">
             <div className="mb-10 text-center lg:text-left">
               <h1 className="text-3xl font-bold font-display text-[#111827]">Boas-vindas! 👋</h1>
               <p className="text-[#6B7280] mt-2">
                 Por favor, insira seus dados para acessar sua conta.
               </p>
             </div>
 
             <form onSubmit={handle} className="space-y-5">
               <div>
                 <label className="text-sm font-semibold text-[#374151] mb-2 block">E-mail corporativo</label>
                 <div className="relative group">
                   <div className="absolute left-4 top-1/2 -translate-y-1/2 text-[#9CA3AF] group-focus-within:text-primary transition-colors">
                     <Mail className="h-5 w-5" />
                   </div>
                   <input 
                     type="email" 
                     placeholder="exemplo@empresa.com"
                     defaultValue="renato@conectacrm.com" 
                     className="w-full h-12 pl-12 pr-4 rounded-xl border border-[#E5E7EB] bg-[#F9FAFB] focus:bg-white focus:border-primary focus:ring-4 focus:ring-primary/10 outline-none transition-all text-sm" 
                   />
                 </div>
               </div>
 
               <div>
                 <div className="flex items-center justify-between mb-2">
                   <label className="text-sm font-semibold text-[#374151]">Senha</label>
                   <button type="button" className="text-sm text-primary font-bold hover:underline">Esqueceu a senha?</button>
                 </div>
                 <div className="relative group">
                   <div className="absolute left-4 top-1/2 -translate-y-1/2 text-[#9CA3AF] group-focus-within:text-primary transition-colors">
                     <Lock className="h-5 w-5" />
                   </div>
                   <input 
                     type={showPassword ? "text" : "password"} 
                     placeholder="••••••••"
                     defaultValue="demo1234" 
                     className="w-full h-12 pl-12 pr-12 rounded-xl border border-[#E5E7EB] bg-[#F9FAFB] focus:bg-white focus:border-primary focus:ring-4 focus:ring-primary/10 outline-none transition-all text-sm" 
                   />
                   <button 
                     type="button"
                     onClick={() => setShowPassword(!showPassword)}
                     className="absolute right-4 top-1/2 -translate-y-1/2 text-[#9CA3AF] hover:text-[#6B7280] transition-colors"
                   >
                     {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                   </button>
                 </div>
               </div>
 
               <div className="flex items-center gap-3 py-2">
                 <input 
                   type="checkbox" 
                   id="remember"
                   className="h-5 w-5 rounded-md border-[#E5E7EB] text-primary focus:ring-primary transition-colors" 
                   defaultChecked 
                 />
                 <label htmlFor="remember" className="text-sm text-[#4B5563] select-none cursor-pointer">Manter-me conectado por 30 dias</label>
               </div>
 
               <button 
                 type="submit" 
                 disabled={loading} 
                 className="w-full h-12 rounded-xl bg-primary text-white font-bold text-base shadow-lg shadow-primary/20 hover:bg-primary/90 active:scale-[0.98] transition-all flex items-center justify-center gap-2 disabled:opacity-70"
               >
                 {loading ? (
                   <div className="h-5 w-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                 ) : (
                   <>Entrar na plataforma <ArrowRight className="h-5 w-5" /></>
                 )}
               </button>
             </form>
 
             <div className="mt-8 pt-8 border-t border-[#F3F4F6] text-center">
               <p className="text-sm text-[#6B7280]">
                 Ainda não tem acesso? <button className="text-primary font-bold hover:underline">Solicite uma demonstração</button>
               </p>
             </div>
           </div>
         </div>
       </div>
     </div>
   );
 }
