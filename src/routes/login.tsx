import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { Mail, Lock, ArrowRight, Eye, EyeOff, CheckCircle2 } from "lucide-react";
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
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
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
    <div className="min-h-screen grid lg:grid-cols-[1fr_1.1fr] bg-background overflow-hidden relative font-sans">
      <NetworkBackground />
       {/* Left side */}
      <div className="flex flex-col justify-center px-8 sm:px-16 lg:px-24 py-12 relative z-10 bg-background/60 backdrop-blur-md border-r border-border/50">
        <Link to="/" className="flex items-center gap-2 mb-10">
          <div className="h-8 w-8 rounded-lg bg-primary grid place-items-center">
            <div className="h-4 w-4 bg-white rounded-sm" />
          </div>
          <span className="font-bold text-xl tracking-tight text-foreground">ConectaCRM</span>
        </Link>

        <div className="max-w-md w-full">
          <h1 className="text-4xl font-bold text-foreground tracking-tight mb-3">Bem-vindo de volta!</h1>
          <p className="text-muted-foreground text-base mb-10">
            Faça login para acessar o painel administrativo.
          </p>

          <form onSubmit={handle} className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground/80">Seu e-mail</label>
              <div className="relative group">
                <Mail className="h-5 w-5 absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-primary transition-colors" />
                <input 
                  type="email" 
                  placeholder="email@exemplo.com"
                  value={email} 
                  onChange={(e) => setEmail(e.target.value)} 
                  className="w-full h-14 pl-12 pr-4 rounded-xl bg-white border border-border focus:border-primary/50 focus:ring-1 focus:ring-primary/20 outline-none text-foreground transition-all placeholder:text-muted-foreground" 
                  required
                />
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-foreground/80">Sua senha</label>
                <a className="text-sm text-primary hover:underline cursor-pointer">Esqueceu sua senha?</a>
              </div>
              <div className="relative group">
                <Lock className="h-5 w-5 absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-primary transition-colors" />
                <input 
                  type={showPassword ? "text" : "password"} 
                  placeholder="••••••••"
                  value={password} 
                  onChange={(e) => setPassword(e.target.value)} 
                  className="w-full h-14 pl-12 pr-12 rounded-xl bg-white border border-border focus:border-primary/50 focus:ring-1 focus:ring-primary/20 outline-none text-foreground transition-all placeholder:text-muted-foreground" 
                  required
                />
                <button 
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-foreground transition-colors"
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
            </div>

            {error && (
              <div className="rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-400">
                {error}
              </div>
            )}

            <button 
              type="submit" 
              disabled={loading} 
              className="w-full h-14 rounded-xl bg-primary text-primary-foreground font-bold text-base hover:bg-primary/90 active:scale-[0.98] transition-all disabled:opacity-50 mt-4 shadow-sm"
            >
              {loading ? "Entrando..." : "Entrar na conta"}
            </button>
          </form>

          <div className="mt-8 text-center text-muted-foreground">
            Ainda não tem conta? <Link to="/registro" className="text-primary font-semibold hover:underline cursor-pointer">Crie agora</Link>
          </div>
        </div>
        
        <div className="mt-auto pt-10 text-muted-foreground text-xs">
          © 2026 ConectaCRM. Todos os direitos reservados.
        </div>
      </div>

      {/* Right side — Clean aesthetic preview */}
      <div className="hidden lg:flex relative overflow-hidden bg-muted/30 p-12 items-center justify-center">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-[120px]" />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500/5 rounded-full blur-[120px]" />
        </div>

        <div className="relative z-10 w-full max-w-2xl">
          <div className="bg-white/70 backdrop-blur-xl border border-border rounded-[2.5rem] p-8 shadow-2xl overflow-hidden relative group">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
            
            <div className="relative z-10 space-y-8">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <h3 className="text-2xl font-bold text-foreground tracking-tight">Dashboard Executivo</h3>
                  <p className="text-muted-foreground text-sm">Visão geral do seu desempenho comercial</p>
                </div>
                <div className="h-12 w-12 rounded-2xl bg-primary/20 border border-primary/20 flex items-center justify-center">
                  <ArrowRight className="h-6 w-6 text-primary" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                {[
                  { label: "Vendas Totais", value: "R$ 124.500", trend: "+12%" },
                  { label: "Novos Leads", value: "842", trend: "+5%" },
                ].map((stat, i) => (
                  <div key={i} className="bg-muted/50 border border-border/50 rounded-2xl p-5">
                    <p className="text-muted-foreground text-xs font-medium uppercase tracking-wider mb-2">{stat.label}</p>
                    <div className="flex items-end justify-between">
                      <span className="text-2xl font-bold text-foreground">{stat.value}</span>
                      <span className="text-primary text-xs font-bold">{stat.trend}</span>
                    </div>
                  </div>
                ))}
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-foreground font-semibold">Recursos Ativos</span>
                  <span className="text-muted-foreground text-xs hover:text-primary transition-colors cursor-pointer underline">Ver todos</span>
                </div>
                <div className="space-y-3">
                  {[
                    "Automação de fluxos de cadência",
                    "Integração nativa com WhatsApp",
                    "Análise preditiva de churn",
                  ].map((feature, i) => (
                    <div key={i} className="flex items-center gap-3 text-foreground/80">
                      <CheckCircle2 className="h-5 w-5 text-primary flex-shrink-0" />
                      <span className="text-sm">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="pt-4 flex items-center gap-4">
                 <div className="flex -space-x-3">
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="h-10 w-10 rounded-full border-2 border-white bg-muted overflow-hidden ring-1 ring-black/5">
                      <img src={`https://i.pravatar.cc/100?img=${i+30}`} alt="User" className="w-full h-full object-cover" />
                    </div>
                  ))}
                </div>
                <p className="text-muted-foreground text-sm">
                  <span className="text-foreground font-bold">+15.000</span> usuários confiam na ConectaCRM
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
     </div>
   );
 }
