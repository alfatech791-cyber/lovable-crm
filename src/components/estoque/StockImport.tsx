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
 import { History, RotateCcw, Check, AlertCircle } from "lucide-react";
 import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
 import { Badge } from "@/components/ui/badge";
 import { ScrollArea } from "@/components/ui/scroll-area";
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
   const [step, setStep] = useState<'upload' | 'preview' | 'history'>('upload');
   const [previewData, setPreviewData] = useState<any[]>([]);
   const [currentFile, setCurrentFile] = useState<File | null>(null);
   const [importHistory, setImportHistory] = useState<any[]>([]);
   const fileInputRef = useRef<HTMLInputElement>(null);
 
   const fetchHistory = async () => {
     if (!user?.id) return;
     const { data, error } = await supabase
       .from('import_history')
       .select('*')
       .order('created_at', { ascending: false });
     if (!error) setImportHistory(data || []);
   };
 
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
            setPreviewData(data.products);
            setStep('preview');
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
 
            const products = data.map((row: any) => {
              // Helper to find a value by searching for multiple possible key names (case-insensitive)
              const findVal = (possibleKeys: string[]) => {
                const keys = Object.keys(row);
                const key = keys.find(k => 
                  possibleKeys.some(pk => k.toLowerCase().includes(pk.toLowerCase()))
                );
                return key ? row[key] : null;
              };

               const nameVal = findVal(['nome', 'produto', 'description', 'descrição', 'item', 'modelo', 'model']);
               const modelVal = findVal(['modelo', 'model']);
               
               // Use model if name is missing or too generic
               let finalName = String(nameVal || modelVal || "Produto sem nome");
               if (finalName === "Produto sem nome" && modelVal) {
                 finalName = String(modelVal);
               }

               const parseCurrency = (val: any) => {
                 if (val === null || val === undefined) return 0;
                 if (typeof val === 'number') return val;
                 const str = String(val).replace('R$', '').trim();
                 if (str.includes(',') && str.includes('.')) {
                   // Formato como 1.234,56
                   return Number(str.replace(/\./g, '').replace(',', '.'));
                 } else if (str.includes(',')) {
                   // Formato como 1234,56
                   return Number(str.replace(',', '.'));
                 }
                 return Number(str);
               };

               const priceVal = findVal(['venda', 'preço', 'valor', 'price', 'unitário', 'vlr', 'saída', 'valor venda']);
               const costVal = findVal(['custo', 'compra', 'cost', 'entrada', 'preço custo', 'valor custo']);
               
               const price = parseCurrency(priceVal);
               const cost = parseCurrency(costVal);
               const stock = Number(findVal(['estoque', 'qtd', 'quantidade', 'stock', 'saldo', 'atual', 'disponível']) || 0);
               
              return {
                user_id: user.id,
                 name: finalName,
                price,
                cost_price: cost,
                stock_quantity: stock,
                category: String(findVal(['categoria', 'category', 'grupo']) || "Importado"),
                brand: String(findVal(['marca', 'brand', 'fabricante']) || ""),
                model: String(findVal(['modelo', 'model']) || ""),
                sku: String(findVal(['sku', 'código', 'cod']) || ""),
                imei: String(findVal(['imei', 'serial', 'sn']) || ""),
                reference: String(findVal(['referência', 'ref', 'id']) || ""),
                ncm: String(findVal(['ncm']) || ""),
                ean: String(findVal(['ean', 'barras', 'barcode']) || ""),
              };
            }).filter(p => p.name !== "Produto sem nome" || p.price > 0 || p.stock_quantity > 0);
 
            setPreviewData(products);
            setStep('preview');
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
 
   const saveProducts = async () => {
     if (!user?.id || previewData.length === 0) return;
     setLoading(true);
     try {
       const { data: history, error: hErr } = await supabase
         .from('import_history')
         .insert({
           user_id: user.id,
           file_name: currentFile?.name || 'Importação via IA',
           file_type: currentFile?.name.split('.').pop() || 'pdf',
           items_count: previewData.length,
           status: 'success'
         })
         .select()
         .single();
 
       if (hErr) throw hErr;
 
       const productsToInsert = previewData.map(p => ({
         ...p,
         user_id: user.id,
         import_id: history.id
       }));
 
       const { data, error } = await supabase
         .from("products")
         .insert(productsToInsert)
         .select();
 
       if (error) throw error;
 
       toast.success(`${data.length} produtos importados com sucesso!`);
       onImported(data);
       setIsOpen(false);
       setStep('upload');
       setPreviewData([]);
     } catch (error: any) {
       toast.error("Erro ao salvar produtos: " + error.message);
     } finally {
       setLoading(false);
     }
   };
 
   const handleReverse = async (importId: string) => {
     if (!confirm("Tem certeza que deseja reverter esta importação? Todos os produtos vinculados a ela serão removidos.")) return;
     setLoading(true);
     try {
       const { error: pErr } = await supabase.from('products').delete().eq('import_id', importId);
       if (pErr) throw pErr;
       const { error: hErr } = await supabase.from('import_history').update({ status: 'reversed' }).eq('id', importId);
       if (hErr) throw hErr;
       toast.success("Importação revertida com sucesso.");
       fetchHistory();
       // Opcional: recarregar lista principal de produtos
       window.location.reload();
     } catch (e: any) {
       toast.error("Erro ao reverter: " + e.message);
     } finally {
       setLoading(false);
     }
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