import { createFileRoute } from "@tanstack/react-router";
import { AppSidebar } from "@/components/layout/Sidebar";
import { Topbar } from "@/components/layout/Topbar";
 import { User, Shield, Bell, Zap, Database, Smartphone, Palette, HelpCircle, ChevronRight, Globe, Lock, Plus } from "lucide-react";

export const Route = createFileRoute("/configuracoes")({
  head: () => ({ meta: [{ title: "Configurações — ConectaCRM" }, { name: "description", content: "Ajuste suas preferências e integrações" }] }),
  component: SettingsPage,
});

 import { useState } from "react";
 import { Input } from "@/components/ui/input";
 import { Button } from "@/components/ui/button";
 import { Label } from "@/components/ui/label";
 import { Switch } from "@/components/ui/switch";
 import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
 import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
 import { toast } from "sonner";
 
 function SettingsPage() {
   const [activeTab, setActiveTab] = useState("perfil");
 
   return (
     <div className="min-h-screen flex w-full bg-background">
       <AppSidebar />
       <div className="flex-1 flex flex-col min-w-0">
         <Topbar title="Configurações" subtitle="Gerencie sua conta e preferências do sistema" />
         <main className="flex-1 overflow-y-auto p-6">
           <div className="max-w-6xl mx-auto space-y-6">
             <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
               <div className="flex items-center justify-between">
                 <TabsList className="bg-muted/50 p-1 rounded-xl">
                   <TabsTrigger value="perfil" className="rounded-lg gap-2"><User className="h-4 w-4" /> Perfil</TabsTrigger>
                   <TabsTrigger value="vendas" className="rounded-lg gap-2"><Smartphone className="h-4 w-4" /> Vendas</TabsTrigger>
                   <TabsTrigger value="ia" className="rounded-lg gap-2"><Zap className="h-4 w-4" /> IA DeepSeek</TabsTrigger>
                   <TabsTrigger value="integracoes" className="rounded-lg gap-2"><Database className="h-4 w-4" /> Integrações</TabsTrigger>
                   <TabsTrigger value="seguranca" className="rounded-lg gap-2"><Shield className="h-4 w-4" /> Segurança</TabsTrigger>
                 </TabsList>
                 <Button onClick={() => toast.success("Configurações salvas!")} className="bg-gradient-primary shadow-glow">
                   Salvar Alterações
                 </Button>
               </div>
 
               <TabsContent value="perfil">
                 <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                   <Card className="md:col-span-2 border-border shadow-card">
                     <CardHeader>
                       <CardTitle>Informações do Perfil</CardTitle>
                       <CardDescription>Atualize seu nome e como você é visto no sistema.</CardDescription>
                     </CardHeader>
                     <CardContent className="space-y-4">
                       <div className="flex items-center gap-6 pb-6 border-b border-border mb-6">
                         <div className="h-20 w-20 rounded-full bg-gradient-primary grid place-items-center text-2xl font-bold text-white shadow-elegant">RS</div>
                         <div className="space-y-2">
                           <Button variant="outline" size="sm">Alterar Foto</Button>
                           <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-widest">JPG, PNG ou GIF. Máx 2MB.</p>
                         </div>
                       </div>
                       <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                         <div className="space-y-2">
                           <Label>Nome Completo</Label>
                           <Input defaultValue="Renato Silva" />
                         </div>
                         <div className="space-y-2">
                           <Label>E-mail Profissional</Label>
                           <Input defaultValue="renato@conectacrm.com.br" disabled />
                         </div>
                         <div className="space-y-2">
                           <Label>Cargo / Função</Label>
                           <Input defaultValue="Administrador" />
                         </div>
                         <div className="space-y-2">
                           <Label>Telefone WhatsApp</Label>
                           <Input defaultValue="+55 11 99999-9999" />
                         </div>
                       </div>
                     </CardContent>
                   </Card>
 
                   <Card className="border-border shadow-card h-fit">
                     <CardHeader>
                       <CardTitle>Preferências</CardTitle>
                     </CardHeader>
                     <CardContent className="space-y-6">
                       <div className="flex items-center justify-between">
                         <div className="space-y-0.5">
                           <Label>Tema Escuro</Label>
                           <p className="text-[11px] text-muted-foreground">Alternar entre claro e escuro</p>
                         </div>
                         <Switch defaultChecked />
                       </div>
                       <div className="flex items-center justify-between">
                         <div className="space-y-0.5">
                           <Label>Notificações de Som</Label>
                           <p className="text-[11px] text-muted-foreground">Alertas de novas mensagens</p>
                         </div>
                         <Switch defaultChecked />
                       </div>
                     </CardContent>
                   </Card>
                 </div>
               </TabsContent>
 
               <TabsContent value="ia">
                 <Card className="border-border shadow-card">
                   <CardHeader className="flex flex-row items-center justify-between space-y-0">
                     <div className="space-y-1">
                       <CardTitle className="flex items-center gap-2"><Zap className="h-5 w-5 text-primary" /> IA DeepSeek V3</CardTitle>
                       <CardDescription>Configure o cérebro que processa seus atendimentos automáticos.</CardDescription>
                     </div>
                     <div className="px-3 py-1 bg-primary/10 text-primary text-[10px] font-bold uppercase rounded-full border border-primary/20">
                       API Ativa
                     </div>
                   </CardHeader>
                   <CardContent className="space-y-6">
                     <div className="space-y-2">
                       <Label>Chave de API (DeepSeek)</Label>
                       <Input type="password" value="sk-••••••••••••••••••••••••••••••••" />
                       <p className="text-[11px] text-muted-foreground">Sua chave é criptografada e usada apenas para processar mensagens.</p>
                     </div>
                     <div className="space-y-4">
                       <h4 className="text-sm font-bold border-b border-border pb-2">Personalidade do Agente</h4>
                       <div className="space-y-2">
                         <Label>Prompt do Sistema (Contexto)</Label>
                         <textarea className="w-full min-h-[150px] rounded-lg border border-border bg-card p-4 text-sm focus:ring-2 focus:ring-primary/20 outline-none transition" defaultValue={`Você é um especialista em vendas de celulares na ConectaCRM. 
 Seu objetivo é ser técnico, educado e focado em fechamento. 
 Conhece tudo sobre iPhone e Samsung. 
 Use gatilhos mentais de escassez e urgência.`} />
                       </div>
                     </div>
                   </CardContent>
                 </Card>
               </TabsContent>
 
               <TabsContent value="integracoes">
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                   <Card className="border-border shadow-card">
                     <CardHeader>
                       <CardTitle className="flex items-center gap-2"><Database className="h-5 w-5 text-blue-500" /> Evolution API</CardTitle>
                       <CardDescription>Conecte suas instâncias de WhatsApp.</CardDescription>
                     </CardHeader>
                     <CardContent className="space-y-4">
                       <div className="space-y-2">
                         <Label>URL da API</Label>
                         <Input defaultValue="https://evolution.seuservidor.com" />
                       </div>
                       <div className="space-y-2">
                         <Label>Global API Key</Label>
                         <Input type="password" value="••••••••••••••••••••" />
                       </div>
                       <Button variant="outline" className="w-full">Testar Conexão</Button>
                     </CardContent>
                   </Card>
 
                   <Card className="border-border shadow-card">
                     <CardHeader>
                       <CardTitle className="flex items-center gap-2"><Globe className="h-5 w-5 text-emerald-500" /> Webhooks de Entrada</CardTitle>
                       <CardDescription>Receba leads de sites externos ou Typeform.</CardDescription>
                     </CardHeader>
                     <CardContent className="space-y-4">
                       <div className="p-3 bg-muted rounded-lg border border-border">
                         <code className="text-[10px] break-all">https://api.conectacrm.app/webhook/v1/987654321</code>
                       </div>
                       <Button variant="secondary" size="sm" className="w-full gap-2"><Plus className="h-4 w-4" /> Criar Novo Webhook</Button>
                     </CardContent>
                   </Card>
                 </div>
               </TabsContent>
             </Tabs>
 
             {/* Help Card */}
             <div className="rounded-2xl bg-muted/40 border border-border p-6 flex items-start gap-4">
               <div className="h-12 w-12 rounded-2xl bg-card border border-border grid place-items-center text-primary shadow-sm shrink-0">
                 <HelpCircle className="h-6 w-6" />
               </div>
               <div>
                 <h4 className="font-bold text-base mb-1">Precisa de ajuda com a configuração?</h4>
                 <p className="text-sm text-muted-foreground mb-4">Acesse nossa Central de Ajuda para tutoriais completos sobre como conectar o WhatsApp e treinar sua IA.</p>
                 <div className="flex gap-3">
                   <Button size="sm">Acessar Documentação</Button>
                   <Button variant="outline" size="sm">Falar com Suporte</Button>
                 </div>
               </div>
             </div>
           </div>
         </main>
       </div>
     </div>
   );
 }
