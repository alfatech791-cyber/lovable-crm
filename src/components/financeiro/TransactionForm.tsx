 import { useState, useEffect } from "react";
 import { Button } from "@/components/ui/button";
 import { Input } from "@/components/ui/input";
 import { Label } from "@/components/ui/label";
 import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
 import { Dialog as ShadcnDialog, DialogContent as ShadcnDialogContent, DialogHeader as ShadcnDialogHeader, DialogTitle as ShadcnDialogTitle, DialogFooter as ShadcnDialogFooter } from "@/components/ui/dialog";
 import { Textarea } from "@/components/ui/textarea";
 import { Switch } from "@/components/ui/switch";
 import { ScrollArea } from "@/components/ui/scroll-area";
 import { Separator } from "@/components/ui/separator";
 import { Wallet, Calendar, Tag, FileText, Repeat } from "lucide-react";
 
 interface TransactionFormProps {
   open: boolean;
   onOpenChange: (open: boolean) => void;
   onSave: (data: any) => void;
   transaction?: any;
 }
 
 export function TransactionForm({ open, onOpenChange, onSave, transaction }: TransactionFormProps) {
   const [formData, setFormData] = useState<any>({
     description: "",
     amount: "",
     type: "income",
     category: "Geral",
     status: "paid",
     payment_date: new Date().toISOString().split('T')[0],
     payment_method: "Pix",
     payment_account: "Conta Principal",
     notes: "",
     tags: "",
     recurring: false,
     recurrence_period: "monthly",
   });
 
   useEffect(() => {
     if (transaction) {
       setFormData({
         description: transaction.description || "",
         amount: transaction.amount || "",
         type: transaction.type || "income",
         category: transaction.category || "Geral",
         status: transaction.status || "paid",
         payment_date: transaction.payment_date || new Date().toISOString().split('T')[0],
         payment_method: transaction.payment_method || "Pix",
         payment_account: transaction.payment_account || "Conta Principal",
         notes: transaction.notes || "",
         tags: transaction.tags?.join(", ") || "",
         recurring: transaction.recurring || false,
         recurrence_period: transaction.recurrence_period || "monthly",
       });
     } else if (open) {
       setFormData({
         description: "",
         amount: "",
         type: "income",
         category: "Geral",
         status: "paid",
         payment_date: new Date().toISOString().split('T')[0],
         payment_method: "Pix",
         payment_account: "Conta Principal",
         notes: "",
         tags: "",
         recurring: false,
         recurrence_period: "monthly",
       });
     }
   }, [transaction, open]);
 
   const handleSubmit = (e: React.FormEvent) => {
     e.preventDefault();
     onSave({
       ...formData,
       amount: parseFloat(formData.amount.toString()),
       tags: formData.tags ? formData.tags.split(",").map((t: string) => t.trim()).filter(Boolean) : [],
     });
     onOpenChange(false);
   };
 
   return (
     <ShadcnDialog open={open} onOpenChange={onOpenChange}>
       <ShadcnDialogContent className="sm:max-w-[600px] max-h-[90vh] p-0 overflow-hidden flex flex-col">
         <ShadcnDialogHeader className="p-6 pb-0">
           <ShadcnDialogTitle>{transaction ? "Editar Lançamento" : "Novo Lançamento Financeiro"}</ShadcnDialogTitle>
         </ShadcnDialogHeader>
         <form onSubmit={handleSubmit} className="flex flex-col flex-1 overflow-hidden">
           <ScrollArea className="flex-1 px-6 py-4">
             <div className="space-y-6">
               {/* Section: Basic Information */}
               <div className="space-y-4">
                 <div className="flex items-center gap-2 text-primary font-medium">
                   <FileText className="w-4 h-4" />
                   Informações Básicas
                 </div>
                 <Separator />
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
                 <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                   <div className="space-y-2">
                     <Label htmlFor="amount">Valor (R$)</Label>
                     <Input 
                       id="amount" 
                       type="number" 
                       step="0.01"
                       value={formData.amount} 
                       onChange={(e) => setFormData({ ...formData, amount: e.target.value })} 
                       placeholder="0,00"
                       className="text-lg font-semibold"
                       required
                     />
                   </div>
                   <div className="space-y-2">
                     <Label htmlFor="type">Tipo</Label>
                     <Select 
                       value={formData.type} 
                       onValueChange={(value) => setFormData({ ...formData, type: value })}
                     >
                       <SelectTrigger className={formData.type === 'income' ? 'text-green-600' : 'text-red-600'}>
                         <SelectValue placeholder="Selecione o tipo" />
                       </SelectTrigger>
                       <SelectContent>
                         <SelectItem value="income" className="text-green-600">Receita (+)</SelectItem>
                         <SelectItem value="expense" className="text-red-600">Despesa (-)</SelectItem>
                       </SelectContent>
                     </Select>
                   </div>
                 </div>
               </div>
 
               {/* Section: Payment & Date */}
               <div className="space-y-4 pt-2">
                 <div className="flex items-center gap-2 text-primary font-medium">
                   <Wallet className="w-4 h-4" />
                   Pagamento e Data
                 </div>
                 <Separator />
                 <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                   <div className="space-y-2">
                     <Label htmlFor="payment_date">Data</Label>
                     <div className="relative">
                       <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                       <Input 
                         id="payment_date" 
                         type="date"
                         className="pl-9"
                         value={formData.payment_date} 
                         onChange={(e) => setFormData({ ...formData, payment_date: e.target.value })} 
                         required
                       />
                     </div>
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
                         <SelectItem value="overdue">Atrasado</SelectItem>
                       </SelectContent>
                     </Select>
                   </div>
                 </div>
                 <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                   <div className="space-y-2">
                     <Label htmlFor="payment_method">Forma de Pagamento</Label>
                     <Select 
                       value={formData.payment_method} 
                       onValueChange={(value) => setFormData({ ...formData, payment_method: value })}
                     >
                       <SelectTrigger>
                         <SelectValue />
                       </SelectTrigger>
                       <SelectContent>
                         <SelectItem value="Pix">Pix</SelectItem>
                         <SelectItem value="Cartão de Crédito">Cartão de Crédito</SelectItem>
                         <SelectItem value="Cartão de Débito">Cartão de Débito</SelectItem>
                         <SelectItem value="Dinheiro">Dinheiro</SelectItem>
                         <SelectItem value="Boleto">Boleto</SelectItem>
                         <SelectItem value="Transferência">Transferência</SelectItem>
                       </SelectContent>
                     </Select>
                   </div>
                   <div className="space-y-2">
                     <Label htmlFor="payment_account">Conta / Caixa</Label>
                     <Select 
                       value={formData.payment_account} 
                       onValueChange={(value) => setFormData({ ...formData, payment_account: value })}
                     >
                       <SelectTrigger>
                         <SelectValue />
                       </SelectTrigger>
                       <SelectContent>
                         <SelectItem value="Conta Principal">Conta Principal</SelectItem>
                         <SelectItem value="Caixa da Loja">Caixa da Loja</SelectItem>
                         <SelectItem value="Reserva">Reserva</SelectItem>
                       </SelectContent>
                     </Select>
                   </div>
                 </div>
               </div>
 
               {/* Section: Classification */}
               <div className="space-y-4 pt-2">
                 <div className="flex items-center gap-2 text-primary font-medium">
                   <Tag className="w-4 h-4" />
                   Classificação e Detalhes
                 </div>
                 <Separator />
                 <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
                     <Label htmlFor="tags">Tags (separadas por vírgula)</Label>
                     <Input 
                       id="tags" 
                       value={formData.tags} 
                       onChange={(e) => setFormData({ ...formData, tags: e.target.value })} 
                       placeholder="Ex: urgente, fornecedor..."
                     />
                   </div>
                 </div>
                 <div className="space-y-2">
                   <Label htmlFor="notes">Observações</Label>
                   <Textarea 
                     id="notes" 
                     value={formData.notes} 
                     onChange={(e) => setFormData({ ...formData, notes: e.target.value })} 
                     placeholder="Adicione detalhes extras aqui..."
                     className="resize-none"
                   />
                 </div>
               </div>
 
               {/* Section: Recurrence */}
               <div className="space-y-4 pt-2">
                 <div className="flex items-center justify-between">
                   <div className="flex items-center gap-2 text-primary font-medium">
                     <Repeat className="w-4 h-4" />
                     Recorrência
                   </div>
                   <Switch 
                     checked={formData.recurring} 
                     onCheckedChange={(checked) => setFormData({ ...formData, recurring: checked })} 
                   />
                 </div>
                 <Separator />
                 {formData.recurring && (
                   <div className="space-y-2 animate-in fade-in slide-in-from-top-2">
                     <Label htmlFor="recurrence_period">Frequência</Label>
                     <Select 
                       value={formData.recurrence_period} 
                       onValueChange={(value) => setFormData({ ...formData, recurrence_period: value })}
                     >
                       <SelectTrigger>
                         <SelectValue />
                       </SelectTrigger>
                       <SelectContent>
                         <SelectItem value="daily">Diário</SelectItem>
                         <SelectItem value="weekly">Semanal</SelectItem>
                         <SelectItem value="monthly">Mensal</SelectItem>
                         <SelectItem value="yearly">Anual</SelectItem>
                       </SelectContent>
                     </Select>
                   </div>
                 )}
               </div>
             </div>
           </ScrollArea>
            <div className="p-6 pt-2 border-t mt-auto">
              <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 h-11 text-base font-semibold rounded-xl">
                {transaction ? "Salvar Alterações" : "Confirmar Lançamento"}
              </Button>
            </div>
         </form>
       </ShadcnDialogContent>
     </ShadcnDialog>
   );
 }