 import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
  import { useState, useEffect, useCallback } from "react";
 import { evolution, Instance } from "@/lib/evolution";
 import { QrCodeModal } from "@/components/whatsapp/QrCodeModal";
 import { MessageSquare, RefreshCw, LogOut, Power, Trash2, Smartphone } from "lucide-react";
 import { toast } from "sonner";
 import { Badge } from "@/components/ui/badge";
 import { Skeleton } from "@/components/ui/skeleton";

export default function Configuracoes() {
   const [instances, setInstances] = useState<Instance[]>([]);
   const [loading, setLoading] = useState(true);
   const [showQrModal, setShowQrModal] = useState(false);
    const [selectedInstance, setSelectedInstance] = useState<string | null>(null);
    const [isCreating, setIsCreating] = useState(false);
    const fetchInstances = useCallback(async () => {
     try {
       setLoading(true);
       const data = await evolution.getInstances();
       setInstances(data);
     } catch (err) {
       console.error(err);
        toast.error("Erro ao carregar instâncias do WhatsApp");
     } finally {
       setLoading(false);
     }
    }, []);
 
   useEffect(() => {
     fetchInstances();
   }, []);
 
    const handleCreateInstance = async () => {
      if (isCreating) return;
      
      setIsCreating(true);
      // Gerar um nome baseado no timestamp para garantir unicidade
      const name = `whatsapp_${Date.now()}`;
      const webhookUrl = import.meta.env.VITE_WEBHOOK_URL || "";
      
      try {
        await evolution.createInstance(name, webhookUrl);
        setSelectedInstance(name);
        setShowQrModal(true);
        await fetchInstances();
      } catch (err) {
        console.error(err);
        toast.error("Erro ao criar nova instância de WhatsApp");
      } finally {
        setIsCreating(false);
      }
    };
 
   const handleDisconnect = async (name: string) => {
     try {
       await evolution.logoutInstance(name);
       toast.success("Instância desconectada");
       fetchInstances();
     } catch (err) {
       toast.error("Erro ao desconectar");
     }
   };
 
   const handleDelete = async (name: string) => {
     try {
       await evolution.deleteInstance(name);
       toast.success("Instância removida");
       fetchInstances();
     } catch (err) {
       toast.error("Erro ao remover");
     }
   };
 
  return (
    <div className="p-6 space-y-6">
      <h1 className="text-3xl font-bold tracking-tight">Configurações</h1>
      
      <Tabs defaultValue="geral" className="w-full">
        <TabsList>
          <TabsTrigger value="geral">Geral</TabsTrigger>
          <TabsTrigger value="loja">Dados da Loja</TabsTrigger>
          <TabsTrigger value="usuarios">Usuários</TabsTrigger>
          <TabsTrigger value="notificacoes">Notificações</TabsTrigger>
           <TabsTrigger value="integracoes">Integrações</TabsTrigger>
        </TabsList>
        <TabsContent value="geral">
          <Card>
            <CardHeader>
              <CardTitle>Configurações Gerais</CardTitle>
              <CardDescription>Gerencie as preferências básicas do sistema.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid w-full max-w-sm items-center gap-1.5">
                <Label htmlFor="nome-sistema">Nome do Sistema</Label>
                <Input type="text" id="nome-sistema" placeholder="Gestão Assistência" />
              </div>
              <Button>Salvar Alterações</Button>
            </CardContent>
          </Card>
        </TabsContent>
 
         <TabsContent value="integracoes">
           <div className="grid gap-6">
             <Card>
               <CardHeader className="flex flex-row items-center justify-between space-y-0">
                 <div>
                   <CardTitle className="flex items-center gap-2">
                     <MessageSquare className="h-5 w-5 text-[#25D366]" />
                     WhatsApp (Evolution API)
                   </CardTitle>
                   <CardDescription>
                     Conecte seu WhatsApp para enviar notificações e gerenciar atendimentos.
                   </CardDescription>
                 </div>
                  <Button 
                    onClick={handleCreateInstance} 
                    disabled={isCreating}
                    className="bg-[#25D366] hover:bg-[#128C7E] text-white"
                  >
                    {isCreating ? (
                      <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                    ) : (
                      <Power className="mr-2 h-4 w-4" />
                    )}
                    {isCreating ? "Criando..." : "Nova Conexão"}
                 </Button>
               </CardHeader>
               <CardContent>
                 {loading ? (
                   <div className="space-y-4">
                     <Skeleton className="h-20 w-full rounded-xl" />
                     <Skeleton className="h-20 w-full rounded-xl" />
                   </div>
                 ) : instances.length === 0 ? (
                   <div className="text-center py-10 border-2 border-dashed rounded-2xl">
                     <MessageSquare className="h-12 w-12 text-muted-foreground mx-auto mb-4 opacity-20" />
                     <p className="text-muted-foreground">Nenhuma instância conectada.</p>
                     <p className="text-xs text-muted-foreground mt-1">
                       Clique em "Nova Conexão" para gerar seu primeiro QR Code.
                     </p>
                   </div>
                 ) : (
                   <div className="space-y-4">
                     {instances.map((instance) => (
                       <div 
                         key={instance.instanceId} 
                         className="flex items-center justify-between p-4 border rounded-2xl bg-card hover:bg-accent/5 transition-colors"
                       >
                         <div className="flex items-center gap-4">
                           <div className={`h-12 w-12 rounded-full grid place-items-center ${instance.status === 'open' ? 'bg-success/20 text-success' : 'bg-muted text-muted-foreground'}`}>
                             <Smartphone className="h-6 w-6" />
                           </div>
                           <div>
                             <div className="flex items-center gap-2">
                               <p className="font-bold">{instance.instanceName}</p>
                               <Badge 
                                 variant={instance.status === 'open' ? "default" : "secondary"} 
                                 className={`text-[10px] uppercase font-bold ${instance.status === 'open' ? "bg-success hover:bg-success/80" : ""}`}
                               >
                                 {instance.status === 'open' ? 'Conectado' : 'Desconectado'}
                               </Badge>
                             </div>
                             <p className="text-xs text-muted-foreground">ID: {instance.instanceId}</p>
                           </div>
                         </div>
                         
                         <div className="flex items-center gap-2">
                           {instance.status !== 'open' && (
                             <Button 
                               size="sm" 
                               variant="outline" 
                               onClick={() => {
                                 setSelectedInstance(instance.instanceName);
                                 setShowQrModal(true);
                               }}
                             >
                               <RefreshCw className="mr-2 h-4 w-4" />
                               Gerar QR Code
                             </Button>
                           )}
                           
                           {instance.status === 'open' && (
                             <Button 
                               size="sm" 
                               variant="outline" 
                               className="text-orange-500 hover:text-orange-600"
                               onClick={() => handleDisconnect(instance.instanceName)}
                             >
                               <LogOut className="mr-2 h-4 w-4" />
                               Desconectar
                             </Button>
                           )}
 
                           <Button 
                             size="sm" 
                             variant="ghost" 
                             className="text-destructive hover:bg-destructive/10"
                             onClick={() => handleDelete(instance.instanceName)}
                           >
                             <Trash2 className="h-4 w-4" />
                           </Button>
                         </div>
                       </div>
                     ))}
                   </div>
                 )}
               </CardContent>
             </Card>
 
             <Card>
               <CardHeader>
                 <CardTitle className="text-sm">Dica de Configuração</CardTitle>
                 <CardDescription className="text-xs">
                   Certifique-se de que as variáveis de ambiente <strong>VITE_EVOLUTION_API_URL</strong> e <strong>VITE_EVOLUTION_API_KEY</strong> estejam configuradas no seu projeto para que a integração funcione corretamente.
                 </CardDescription>
               </CardHeader>
             </Card>
           </div>
         </TabsContent>
      </Tabs>
 
       {showQrModal && selectedInstance && (
         <QrCodeModal 
           instanceName={selectedInstance} 
           onClose={() => setShowQrModal(false)} 
           onSuccess={() => {
             setShowQrModal(false);
             fetchInstances();
           }} 
         />
       )}
    </div>
  );
}
