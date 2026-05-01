 import { useState, useEffect, useRef } from "react";
 import { Button } from "@/components/ui/button";
 import { Input } from "@/components/ui/input";
 import { Label } from "@/components/ui/label";
 import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
 import { Dialog as ShadcnDialog, DialogContent as ShadcnDialogContent, DialogHeader as ShadcnDialogHeader, DialogTitle as ShadcnDialogTitle } from "@/components/ui/dialog";
 import { Textarea } from "@/components/ui/textarea";
 import { Switch } from "@/components/ui/switch";
 import { ScrollArea } from "@/components/ui/scroll-area";
 import { Separator } from "@/components/ui/separator";
 import { Wallet, Calendar, Tag, FileText, Repeat, Upload, X, PlusCircle, Trash2, CheckCircle2, AlertCircle } from "lucide-react";
 import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
 import { cn } from "@/lib/utils";
 import { toast } from "sonner";
 
 interface TransactionFormProps {
   open: boolean;
   onOpenChange: (open: boolean) => void;
   onSave: (data: any) => void;
   transaction?: any;
 }
 
 export function TransactionForm({ open, onOpenChange, onSave, transaction }: TransactionFormProps) {
   const [activeTab, setActiveTab] = useState("geral");
   const [formData, setFormData] = useState<any>({
     description: "",
     amount: "",
     type: "income",
     category: "Geral",
     status: "paid",
     payment_date: new Date().toISOString().split('T')[0],
     payment_methods: [{ method: "Pix", amount: "" }],
     payment_account: "Conta Principal",
     notes: "",
     tags: "",
     recurring: false,
     recurrence_period: "monthly",
   });
   const [attachments, setAttachments] = useState<File[]>([]);
   const fileInputRef = useRef<HTMLInputElement>(null);
 
   useEffect(() => {
     if (transaction) {
       setFormData({
         description: transaction.description || "",
         amount: transaction.amount || "",
         type: transaction.type || "income",
         category: transaction.category || "Geral",
         status: transaction.status || "paid",
         payment_date: transaction.payment_date || new Date().toISOString().split('T')[0],
         payment_methods: transaction.payment_methods || [{ method: transaction.payment_method || "Pix", amount: transaction.amount || "" }],
         payment_account: transaction.payment_account || "Conta Principal",
         notes: transaction.notes || "",
         tags: transaction.tags?.join(", ") || "",
         recurring: transaction.recurring || false,
         recurrence_period: transaction.recurrence_period || "monthly",
       });
       setActiveTab("geral");
     } else if (open) {
       setFormData({
         description: "",
         amount: "",
         type: "income",
         category: "Geral",
         status: "paid",
         payment_date: new Date().toISOString().split('T')[0],
         payment_methods: [{ method: "Pix", amount: "" }],
         payment_account: "Conta Principal",
         notes: "",
         tags: "",
         recurring: false,
         recurrence_period: "monthly",
       });
       setAttachments([]);
       setActiveTab("geral");
     }
   }, [transaction, open]);
 
   const addPaymentMethod = () => {
     setFormData({
       ...formData,
       payment_methods: [...formData.payment_methods, { method: "Dinheiro", amount: "" }]
     });
   };
 
   const removePaymentMethod = (index: number) => {
     if (formData.payment_methods.length > 1) {
       const newMethods = [...formData.payment_methods];
       newMethods.splice(index, 1);
       setFormData({ ...formData, payment_methods: newMethods });
     }
   };
 
   const updatePaymentMethod = (index: number, field: string, value: string) => {
     const newMethods = [...formData.payment_methods];
     newMethods[index] = { ...newMethods[index], [field]: value };
     setFormData({ ...formData, payment_methods: newMethods });
   };
 
   const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
     if (e.target.files) {
       const newFiles = Array.from(e.target.files);
       setAttachments(prev => [...prev, ...newFiles]);
       toast.success(`${newFiles.length} arquivo(s) adicionado(s)`);
     }
   };
 
   const removeFile = (index: number) => {
     setAttachments(prev => prev.filter((_, i) => i !== index));
   };
 
   const handleSubmit = (e: React.FormEvent) => {
     e.preventDefault();
     
     if (formData.payment_methods.length > 1) {
       const totalSplit = formData.payment_methods.reduce((acc: number, curr: any) => acc + (parseFloat(curr.amount) || 0), 0);
       const mainAmount = parseFloat(formData.amount.toString()) || 0;
       
       if (Math.abs(totalSplit - mainAmount) > 0.01) {
         toast.error("A soma das formas de pagamento deve ser igual ao valor total.");
         setActiveTab("pagamento");
         return;
       }
     }
 
     onSave({
       ...formData,
       amount: parseFloat(formData.amount.toString()),
       tags: formData.tags ? formData.tags.split(",").map((t: string) => t.trim()).filter(Boolean) : [],
       payment_method: formData.payment_methods[0].method,
       attachments: attachments.map(f => f.name),
     });
     onOpenChange(false);
   };
 