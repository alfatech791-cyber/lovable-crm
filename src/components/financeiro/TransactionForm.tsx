 import { useState } from "react";
 import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/card";
 import { Button } from "@/components/ui/button";
 import { Input } from "@/components/ui/input";
 import { Label } from "@/components/ui/label";
 import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
 import { Dialog as ShadcnDialog, DialogContent as ShadcnDialogContent, DialogHeader as ShadcnDialogHeader, DialogTitle as ShadcnDialogTitle, DialogFooter as ShadcnDialogFooter } from "@/components/ui/dialog";
 
 interface TransactionFormProps {
   open: boolean;
   onOpenChange: (open: boolean) => void;
   onSave: (data: any) => void;
   transaction?: any;
 }
 
 export function TransactionForm({ open, onOpenChange, onSave, transaction }: TransactionFormProps) {
   const [formData, setFormData] = useState({
     description: transaction?.description || "",
     amount: transaction?.amount || "",
     type: transaction?.type || "income",
     category: transaction?.category || "Geral",
     status: transaction?.status || "paid",
     payment_date: transaction?.payment_date || new Date().toISOString().split('T')[0],
   });
 
   const handleSubmit = (e: React.FormEvent) => {
     e.preventDefault();
     onSave({
       ...formData,
       amount: parseFloat(formData.amount.toString()),
     });
     onOpenChange(false);
   };
 
   return (
     <ShadcnDialog open={open} onOpenChange={onOpenChange}>
       <ShadcnDialogContent className="sm:max-w-[425px]">
         <ShadcnDialogHeader>
           <ShadcnDialogTitle>{transaction ? "Editar Lançamento" : "Novo Lançamento Financeiro"}</ShadcnDialogTitle>
         </ShadcnDialogHeader>
         <form onSubmit={handleSubmit} className="space-y-4 py-4">
           <div className="space-y-2">
             <Label htmlFor="description">Descrição</Label>
             <Input 
               id="description" 
               value={formData.description} 
               onChange={(e) => setFormData({ ...formData, description: e.target.value })} 
               placeholder="Ex: Aluguel, Venda de Produto..."
               required
             />
           </div>
           <div className="grid grid-cols-2 gap-4">
             <div className="space-y-2">
               <Label htmlFor="amount">Valor (R$)</Label>
               <Input 
                 id="amount" 
                 type="number" 
                 step="0.01"
                 value={formData.amount} 
                 onChange={(e) => setFormData({ ...formData, amount: e.target.value })} 
                 placeholder="0,00"
                 required
               />
             </div>
             <div className="space-y-2">
               <Label htmlFor="type">Tipo</Label>
               <Select 
                 value={formData.type} 
                 onValueChange={(value) => setFormData({ ...formData, type: value })}
               >
                 <SelectTrigger>
                   <SelectValue placeholder="Selecione o tipo" />
                 </SelectTrigger>
                 <SelectContent>
                   <SelectItem value="income">Receita (+)</SelectItem>
                   <SelectItem value="expense">Despesa (-)</SelectItem>
                 </SelectContent>
               </Select>
             </div>
           </div>
           <div className="grid grid-cols-2 gap-4">
             <div className="space-y-2">
               <Label htmlFor="category">Categoria</Label>
               <Input 
                 id="category" 
                 value={formData.category} 
                 onChange={(e) => setFormData({ ...formData, category: e.target.value })} 
                 placeholder="Ex: Vendas, Operacional..."
               />
             </div>
             <div className="space-y-2">
               <Label htmlFor="status">Status</Label>
               <Select 
                 value={formData.status} 
                 onValueChange={(value) => setFormData({ ...formData, status: value })}
               >
                 <SelectTrigger>
                   <SelectValue placeholder="Selecione o status" />
                 </SelectTrigger>
                 <SelectContent>
                   <SelectItem value="paid">Pago / Recebido</SelectItem>
                   <SelectItem value="pending">Pendente</SelectItem>
                 </SelectContent>
               </Select>
             </div>
           </div>
           <div className="space-y-2">
             <Label htmlFor="payment_date">Data do Pagamento</Label>
             <Input 
               id="payment_date" 
               type="date"
               value={formData.payment_date} 
               onChange={(e) => setFormData({ ...formData, payment_date: e.target.value })} 
               required
             />
           </div>
           <ShadcnDialogFooter>
             <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700">
               {transaction ? "Salvar Alterações" : "Confirmar Lançamento"}
             </Button>
           </ShadcnDialogFooter>
         </form>
       </ShadcnDialogContent>
     </ShadcnDialog>
   );
 }