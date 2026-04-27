import { createFileRoute } from "@tanstack/react-router";
import { AppSidebar } from "@/components/layout/Sidebar";
import { Topbar } from "@/components/layout/Topbar";
import { 
  MessageSquare, Plus, RefreshCw, Power, Trash2, QrCode, 
  CheckCircle2, AlertCircle, Phone, User, Settings2,
  ShieldCheck, Info, Search, Filter, MoreVertical,
  ExternalLink, LogOut, Smartphone
} from "lucide-react";
import { useState, useEffect, useMemo } from "react";
import { evolution, type Instance } from "@/lib/evolution";
import { toast } from "sonner";
import { QrCodeModal } from "@/components/whatsapp/QrCodeModal";

export const Route = createFileRoute("/whatsapp")({
  head: () => ({
    meta: [
      { title: "WhatsApp — ConectaCRM" },
      { name: "description", content: "Gerencie suas conexões do WhatsApp via Evolution API." },
    ],
  }),
  component: WhatsAppPage,
});

