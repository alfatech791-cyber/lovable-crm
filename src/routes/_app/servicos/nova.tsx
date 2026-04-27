 import { PageHeader } from "@/components/layout/PageHeader";
 import { Card } from "@/components/ui/card";
 import { Button } from "@/components/ui/button";
 import { Input } from "@/components/ui/input";
 import { Label } from "@/components/ui/label";
 import { Textarea } from "@/components/ui/textarea";
 import { Wrench } from "lucide-react";
 
 export default function NewOSPage() {
   return (
     <div className="flex flex-col h-full bg-background">
       <PageHeader title="Nova Ordem de Serviço" />
       <main className="flex-1 overflow-y-auto p-6">
         <div className="max-w-4xl mx-auto space-y-6">
           <Card className="p-6 border-border/50 shadow-card">
             <div className="flex items-center gap-3 mb-6">
               <div className="h-10 w-10 rounded-xl bg-primary/10 grid place-items-center text-primary">
                 <Wrench className="h-5 w-5" />
               </div>
               <div>
                 <h2 className="text-lg font-bold">Informações da OS</h2>
                 <p className="text-sm text-muted-foreground">Preencha os dados do cliente e do aparelho.</p>
               </div>
             </div>
             
             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
               <div className="space-y-2">
                 <Label>Cliente</Label>
                 <Input placeholder="Buscar cliente..." />
               </div>
               <div className="space-y-2">
                 <Label>Aparelho</Label>
                 <Input placeholder="Ex: iPhone 13 Pro" />
               </div>
               <div className="space-y-2 md:col-span-2">
                 <Label>Problema Relatado</Label>
                 <Textarea placeholder="Descreva o defeito informado pelo cliente..." className="min-h-[100px]" />
               </div>
             </div>
             
             <div className="mt-8 flex justify-end gap-3">
               <Button variant="outline">Cancelar</Button>
               <Button className="bg-gradient-primary shadow-glow">Criar Ordem de Serviço</Button>
             </div>
           </Card>
         </div>
       </main>
     </div>
   );
 }