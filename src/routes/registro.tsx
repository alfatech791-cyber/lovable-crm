 import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
 import { Sparkles, Mail, Lock, ArrowRight, User } from "lucide-react";
 import { useState } from "react";
 import { supabase } from "@/integrations/supabase/client";
 import { toast } from "sonner";
import { NetworkBackground } from "@/components/ui/network-background";

 export const Route = createFileRoute("/registro")({
   head: () => ({
     meta: [
       { title: "Criar Conta — ConectaCRM" },
       { name: "description", content: "Crie sua conta no ConectaCRM." },
     ],
   }),
   component: Register,
 });

 function Register() {
   const navigate = useNavigate();
   const [loading, setLoading] = useState(false);
   const [name, setName] = useState("");
   const [email, setEmail] = useState("");
   const [password, setPassword] = useState("");
   const [error, setError] = useState("");

   const handleRegister = async (e: React.FormEvent) => {
     e.preventDefault();
     setError("");
     setLoading(true);

     if (!name || !email || !password) {
       setError("Por favor, preencha todos os campos.");
       setLoading(false);
       return;
     }

     const { data, error: signUpError } = await supabase.auth.signUp({
       email: email.trim(),
       password,
       options: {
         data: {
           display_name: name,
         },
       },
     });

     if (signUpError) {
       setError(signUpError.message);
       setLoading(false);
       return;
     }

     toast.success("Conta criada com sucesso! Você já pode entrar.");
     navigate({ to: "/login" });
   };

   return (
    <div className="min-h-screen grid lg:grid-cols-2 bg-black overflow-hidden relative">
      <NetworkBackground />
      <div className="flex flex-col justify-center px-6 sm:px-12 lg:px-20 py-12 relative z-10 bg-black/40 backdrop-blur-sm">
         <Link to="/" className="flex items-center gap-2.5 mb-12">
           <div className="h-10 w-10 rounded-xl bg-gradient-primary grid place-items-center shadow-glow">
             <Sparkles className="h-5 w-5 text-white" strokeWidth={2.5} />
           </div>
           <span className="font-display font-bold text-xl tracking-tight">ConectaCRM</span>
         </Link>

         <div className="max-w-sm w-full">
           <h1 className="text-3xl font-bold font-display tracking-tight">Crie sua conta 🚀</h1>
           <p className="text-sm text-muted-foreground mt-2">
             Comece a gerenciar seus leads e vendas de forma inteligente.
           </p>

           <form onSubmit={handleRegister} className="mt-8 space-y-4">
             <div>
               <label className="text-[12.5px] font-medium text-foreground/80">Nome Completo</label>
               <div className="relative mt-1.5">
                 <User className="h-4 w-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
                 <input
                   type="text"
                   required
                   value={name}
                   onChange={(e) => setName(e.target.value)}
                   className="w-full h-11 pl-10 pr-3 rounded-xl bg-muted/50 border border-border focus:bg-card focus:border-ring outline-none text-sm transition"
                   placeholder="Seu nome"
                 />
               </div>
             </div>
             <div>
               <label className="text-[12.5px] font-medium text-foreground/80">E-mail</label>
               <div className="relative mt-1.5">
                 <Mail className="h-4 w-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
                 <input
                   type="email"
                   required
                   value={email}
                   onChange={(e) => setEmail(e.target.value)}
                   className="w-full h-11 pl-10 pr-3 rounded-xl bg-muted/50 border border-border focus:bg-card focus:border-ring outline-none text-sm transition"
                   placeholder="seu@email.com"
                 />
               </div>
             </div>
             <div>
               <label className="text-[12.5px] font-medium text-foreground/80">Senha</label>
               <div className="relative mt-1.5">
                 <Lock className="h-4 w-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
                 <input
                   type="password"
                   required
                   value={password}
                   onChange={(e) => setPassword(e.target.value)}
                   className="w-full h-11 pl-10 pr-3 rounded-xl bg-muted/50 border border-border focus:bg-card focus:border-ring outline-none text-sm transition"
                   placeholder="Mínimo 6 caracteres"
                 />
               </div>
             </div>

             {error && (
               <div className="rounded-xl border border-destructive/20 bg-destructive/5 px-3 py-2 text-xs text-destructive">
                 {error}
               </div>
             )}

             <button
               type="submit"
               disabled={loading}
               className="w-full h-11 rounded-xl bg-gradient-primary text-primary-foreground font-medium text-sm shadow-elegant hover:opacity-95 inline-flex items-center justify-center gap-2 transition disabled:opacity-70"
             >
               {loading ? "Criando conta..." : <>Criar conta <ArrowRight className="h-4 w-4" /></>}
             </button>
           </form>

           <div className="mt-6 text-center text-[12.5px] text-muted-foreground">
             Já tem uma conta? <Link to="/login" className="text-primary font-semibold hover:text-primary-glow cursor-pointer">Fazer login</Link>
           </div>
         </div>
       </div>

       <div className="hidden lg:flex relative overflow-hidden bg-[#0A0C10] p-10">
         <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/20 rounded-full blur-[120px] -mr-64 -mt-64" />
         <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-primary/10 rounded-full blur-[120px] -ml-64 -mb-64" />
         <div className="relative z-10 w-full h-full flex flex-col">
           <div className="mt-auto space-y-4">
             <h2 className="text-4xl xl:text-5xl font-bold font-display text-white leading-[1.1] tracking-tight">
               Transforme sua gestão <br />
               <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-primary-glow">em resultados reais.</span>
             </h2>
             <p className="text-white/60 text-lg max-w-lg leading-relaxed">
               Junte-se a milhares de empresas que já usam o ConectaCRM para escalar suas operações.
             </p>
           </div>
         </div>
       </div>
     </div>
   );
 }