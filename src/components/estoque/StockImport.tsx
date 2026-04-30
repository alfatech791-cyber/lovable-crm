 import { useState, useRef } from "react";
 import { FileUp, Loader2, Info } from "lucide-react";
 import { Button } from "@/components/ui/button";
 import {
   Dialog,
   DialogContent,
   DialogDescription,
   DialogFooter,
   DialogHeader,
   DialogTitle,
   DialogTrigger,
 } from "@/components/ui/dialog";
 import { toast } from "sonner";
 import * as XLSX from "xlsx";
 import { supabase } from "@/integrations/supabase/client";
 import { useAuth } from "@/contexts/AuthContext";
 
 interface StockImportProps {
   onImported: (products: any[]) => void;
 }
 
 export function StockImport({ onImported }: StockImportProps) {
   const { user } = useAuth();
   const [isOpen, setIsOpen] = useState(false);
   const [loading, setLoading] = useState(false);
   const fileInputRef = useRef<HTMLInputElement>(null);
 
   const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
     const file = e.target.files?.[0];
     if (!file || !user?.id) return;
 
     setLoading(true);
     try {
       const reader = new FileReader();
       
       if (file.name.endsWith(".pdf")) {
         toast.info("Processando PDF... Isso pode levar um momento.");
         // Para PDF, vamos usar uma Edge Function para processar com IA
         const { data, error } = await supabase.functions.invoke("parse-inventory-pdf", {
           body: { 
             fileBase64: await fileToBase64(file),
             fileName: file.name
           }
         });
 
         if (error) throw error;
         if (data?.products) {
           await saveProducts(data.products);
         }
       } else {
         // XLS, XLSX, CSV
         reader.onload = async (event) => {
           const bstr = event.target?.result;
           const wb = XLSX.read(bstr, { type: "binary" });
           const wsname = wb.SheetNames[0];
           const ws = wb.Sheets[wsname];
           const data = XLSX.utils.sheet_to_json(ws);
           
           if (data.length === 0) {
             toast.error("O arquivo parece estar vazio.");
             setLoading(false);
             return;
           }
 
           const products = data.map((row: any) => ({
             user_id: user.id,
             name: String(row.Nome || row.name || row.Produto || row.description || "Produto sem nome"),
             price: Number(row["Preço Venda"] || row.Preço || row.price || row.Valor || row.price_sale || 0),
             cost_price: Number(row["Preço Custo"] || row.Custo || row.cost_price || row.cost || 0),
             stock_quantity: Number(row["Estoque Atual"] || row.Estoque || row.stock || row.quantity || row.stock_quantity || 0),
             category: String(row.Categoria || row.category || row.Category || "Importado"),
             brand: String(row.Marca || row.brand || row.Brand || ""),
             model: String(row.Modelo || row.model || row.Model || ""),
             sku: String(row.SKU || row.sku || ""),
             imei: String(row.IMEI || row.imei || ""),
             reference: String(row.Referência || row.reference || row.Ref || ""),
             ncm: String(row.NCM || row.ncm || ""),
             ean: String(row.EAN || row.ean || row["Código de Barras"] || ""),
           }));
 
           await saveProducts(products);
         };
         reader.readAsBinaryString(file);
       }
     } catch (error: any) {
       console.error("Erro na importação:", error);
       toast.error("Erro ao importar: " + error.message);
       setLoading(false);
     }
   };
 
   const fileToBase64 = (file: File): Promise<string> => {
     return new Promise((resolve, reject) => {
       const reader = new FileReader();
       reader.readAsDataURL(file);
       reader.onload = () => resolve(reader.result?.toString().split(",")[1] || "");
       reader.onerror = (error) => reject(error);
     });
   };
 
   const saveProducts = async (products: any[]) => {
     const { data, error } = await supabase
       .from("products")
       .insert(products)
       .select();
 
     if (error) {
       toast.error("Erro ao salvar produtos: " + error.message);
     } else {
       toast.success(`${data.length} produtos importados com sucesso!`);
       onImported(data);
       setIsOpen(false);
     }
     setLoading(false);
   };
 
   return (
     <Dialog open={isOpen} onOpenChange={setIsOpen}>
       <DialogTrigger asChild>
         <button className="h-10 px-4 rounded-xl border border-border bg-card text-sm font-medium hover:bg-muted transition flex items-center gap-2">
           <FileUp className="h-4 w-4" /> Importar
         </button>
       </DialogTrigger>
       <DialogContent className="sm:max-w-[425px]">
         <DialogHeader>
           <DialogTitle>Importar Estoque</DialogTitle>
           <DialogDescription>
             Selecione um arquivo PDF, XLS ou XLSX para importar seus produtos de outro sistema.
           </DialogDescription>
         </DialogHeader>
         
         <div className="grid gap-4 py-4">
           <div className="flex flex-col items-center justify-center border-2 border-dashed border-border rounded-xl p-8 space-y-4 hover:border-primary/50 transition cursor-pointer" onClick={() => fileInputRef.current?.click()}>
             <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center text-primary">
               {loading ? <Loader2 className="h-6 w-6 animate-spin" /> : <FileUp className="h-6 w-6" />}
             </div>
             <div className="text-center">
               <p className="text-sm font-medium">Clique para selecionar</p>
               <p className="text-xs text-muted-foreground mt-1">PDF, XLS, XLSX ou CSV</p>
             </div>
             <input 
               ref={fileInputRef}
               type="file" 
               className="hidden" 
               accept=".pdf,.xls,.xlsx,.csv" 
               onChange={handleFileChange}
               disabled={loading}
             />
           </div>
 
           <div className="bg-muted/50 rounded-lg p-3 flex gap-3 items-start">
             <Info className="h-4 w-4 text-primary shrink-0 mt-0.5" />
             <div className="text-xs space-y-1">
               <p className="font-bold">Dicas para melhor importação:</p>
               <p>• Use cabeçalhos claros como "Nome", "Preço", "Estoque".</p>
               <p>• Arquivos PDF são processados via IA para identificar os campos.</p>
             </div>
           </div>
         </div>
 
         <DialogFooter>
           <Button variant="ghost" onClick={() => setIsOpen(false)} disabled={loading}>
             Cancelar
           </Button>
         </DialogFooter>
       </DialogContent>
     </Dialog>
   );
 }