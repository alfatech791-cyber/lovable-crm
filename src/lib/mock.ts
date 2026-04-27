export const sidebarItems = [
  { type: "header", title: "Painel Principal" },
  { title: "Dashboard", url: "/", icon: "LayoutDashboard" as const },
  { title: "Relatórios", url: "/relatorios", icon: "BarChart3" as const },

  { type: "header", title: "Atendimento & CRM" },
  { title: "WhatsApp", url: "/whatsapp", icon: "MessageSquare" as const },
  { title: "Instagram", url: "/instagram", icon: "Instagram" as const },
  { title: "CRM Leads", url: "/leads", icon: "UserPlus" as const },
  { title: "Funil de Vendas", url: "/funil", icon: "Trello" as const },
  { title: "Automações", url: "/automacao", icon: "Zap" as const },

  { type: "header", title: "Operação Comercial" },
  {
    title: "Vendas & PDV",
    url: "/vendas",
    icon: "ShoppingBag" as const,
    children: [
      { title: "Frente de Caixa (PDV)", url: "/pdv" },
      { title: "Orçamentos", url: "/vendas/orcamentos" },
      { title: "Histórico de Vendas", url: "/vendas/historico" },
      { title: "Simulador de Taxas", url: "/vendas/simulador" },
      { title: "Gestão Delivery", url: "/vendas/delivery" },
    ]
  },
  {
    title: "Serviços & OS",
    url: "/servicos",
    icon: "Wrench" as const,
    children: [
      { title: "Dashboard OS", url: "/servicos/dashboard" },
      { title: "Nova Ordem", url: "/servicos/nova" },
      { title: "Técnicos", url: "/servicos/tecnicos" },
      { title: "Checklists", url: "/servicos/checklists" },
    ]
  },
  { title: "Agendamentos", url: "/agendamentos", icon: "Calendar" as const },
  { title: "Base de Clientes", url: "/clientes", icon: "Users" as const },

  { type: "header", title: "Logística & Estoque" },
  {
    title: "Estoque",
    url: "/estoque",
    icon: "Box" as const,
    children: [
      { title: "Estoque Atual", url: "/estoque/atual" },
      { title: "Entrada de NF/Compras", url: "/estoque/compras" },
      { title: "Produtos Vendidos", url: "/estoque/vendidos" },
      { title: "Movimentações", url: "/estoque/movimentacoes" },
      { title: "Gerador de Etiquetas", url: "/estoque/etiquetas" },
    ]
  },
  { title: "Catálogo Produtos", url: "/produtos", icon: "Package" as const },

  { type: "header", title: "Controladoria" },
  {
    title: "Financeiro",
    url: "/financeiro",
    icon: "DollarSign" as const,
    children: [
      { title: "Fluxo de Caixa", url: "/financeiro/caixa" },
      { title: "Contas a Pagar", url: "/financeiro/contas-pagar" },
      { title: "Contas a Receber", url: "/financeiro/contas-receber" },
      { title: "Fornecedores", url: "/financeiro/fornecedores" },
      { title: "DRE Gerencial", url: "/financeiro/dre" },
    ]
  },
  { title: "Fiscal (NF-e/NFC-e)", url: "/fiscal", icon: "FileText" as const },

  { type: "header", title: "Configurações" },
  { title: "Equipe", url: "/equipe", icon: "ShieldCheck" as const },
  { title: "Parametrização", url: "/configuracoes", icon: "Settings" as const },
] as any;

 export interface ServiceOrder {
   id: string;
   customer: string;
   device: string;
   problem: string;
   status: "Aguardando" | "Em Análise" | "Aprovado" | "Pronto" | "Entregue";
   priority: "Baixa" | "Média" | "Alta" | "Urgente";
   date: string;
   value?: number;
 }
 
 export const serviceOrders: ServiceOrder[] = [
   { id: "OS1001", customer: "João Silva", device: "iPhone 13", problem: "Troca de Tela", status: "Em Análise", priority: "Alta", date: "2024-03-25" },
   { id: "OS1002", customer: "Maria Oliveira", device: "Samsung S22", problem: "Conector de Carga", status: "Aguardando", priority: "Média", date: "2024-03-26" },
   { id: "OS1003", customer: "Pedro Santos", device: "Motorola G54", problem: "Não Liga", status: "Pronto", priority: "Baixa", date: "2024-03-24", value: 350 },
 ];
 
 export const salesData = [
   { day: "01", value: 1200 }, { day: "05", value: 4500 }, { day: "10", value: 3800 },
   { day: "15", value: 8900 }, { day: "20", value: 12400 }, { day: "25", value: 15600 },
   { day: "30", value: 18200 }
 ];
 
 export const originData = [
   { name: "Google Ads", value: 45, color: "var(--color-primary)" },
   { name: "Facebook Ads", value: 32, color: "var(--color-info)" },
   { name: "Instagram", value: 28, color: "oklch(0.65 0.2 330)" },
   { name: "Indicação", value: 15, color: "var(--color-success)" },
   { name: "Orgânico", value: 12, color: "var(--color-warning)" },
 ];
 
 export const channelSeries = [
   { d: 1, whats: 10, insta: 5 }, { d: 2, whats: 15, insta: 8 },
   { d: 3, whats: 12, insta: 12 }, { d: 4, whats: 25, insta: 15 },
   { d: 5, whats: 30, insta: 22 }, { d: 6, whats: 45, insta: 30 },
   { d: 7, whats: 35, insta: 25 },
 ];

export interface Lead {
  name: string;
  avatar: string;
  channel: string;
  time: string;
  won?: boolean;
}

export interface FunnelStage {
  key: string;
  label: string;
  color: string;
  count: number;
  total: string;
  leads: Lead[];
}

 export const funnelStages: FunnelStage[] = [
   { 
     key: "novo", 
     label: "Novo Contato", 
     color: "var(--color-info)", 
     count: 12, 
     total: "R$ 24.500", 
     leads: [
       { name: "Arthur M.", avatar: "AM", channel: "WhatsApp", time: "10m" },
       { name: "Julia R.", avatar: "JR", channel: "Instagram", time: "45m" }
     ] 
   },
   { 
     key: "atendimento", 
     label: "Em Atendimento", 
     color: "var(--color-warning)", 
     count: 8, 
     total: "R$ 32.800", 
     leads: [
       { name: "Breno C.", avatar: "BC", channel: "WhatsApp", time: "2h" },
       { name: "Kelly S.", avatar: "KS", channel: "WhatsApp", time: "4h" }
     ] 
   },
   { 
     key: "proposta", 
     label: "Proposta", 
     color: "var(--color-primary)", 
     count: 5, 
     total: "R$ 18.200", 
     leads: [
       { name: "Hugo L.", avatar: "HL", channel: "Instagram", time: "1d" }
     ] 
   },
   { 
     key: "fechado", 
     label: "Fechado", 
     color: "var(--color-success)", 
     count: 24, 
     total: "R$ 145.800", 
     leads: [
       { name: "Diego F.", avatar: "DF", channel: "WhatsApp", time: "2d", won: true }
     ] 
   },
 ];

export interface Message {
  name: string;
  time: string;
  text: string;
  channel: string;
  unread: number;
}
 export const messages: Message[] = [
   { name: "Carlos Andrade", time: "14:20", text: "Olá, gostaria de saber mais sobre o iPhone 15 Pro", channel: "whatsapp", unread: 2 },
   { name: "Mariana Silva", time: "13:45", text: "Pode me enviar a tabela de preços atualizada?", channel: "instagram", unread: 1 },
   { name: "Roberto Oliveira", time: "12:10", text: "Obrigado pelo atendimento, vou pensar na proposta.", channel: "whatsapp", unread: 0 },
   { name: "Ana Paula", time: "11:30", text: "Vocês aceitam parcelamento no boleto?", channel: "whatsapp", unread: 0 },
   { name: "Loja do Centro", time: "10:15", text: "Solicitação de orçamento para 10 unidades", channel: "whatsapp", unread: 1 },
 ];

export interface Task {
  text: string;
  count: number;
  done: boolean;
}
 export const tasks: Task[] = [
   { text: "Retornar contato para Roberto", count: 1, done: false },
   { text: "Enviar proposta para Mariana", count: 2, done: false },
   { text: "Revisar estoque de iPhones", count: 1, done: true },
   { text: "Configurar automação de boas-vindas", count: 1, done: false },
 ];

export interface AgendaItem {
  time: string;
  title: string;
}
 export const agenda: AgendaItem[] = [
   { time: "09:00", title: "Reunião de Equipe" },
   { time: "11:30", title: "Visita Cliente - Construtora XYZ" },
   { time: "14:00", title: "Treinamento CRM - Novos Agentes" },
   { time: "16:30", title: "Call de Fechamento" },
 ];

export interface Automation {
  name: string;
  next: string;
  count: number;
  status: string;
}
 export const automations: Automation[] = [
   { name: "Boas-vindas WhatsApp", next: "Imediato", count: 145, status: "Ativo" },
   { name: "Recuperação de Carrinho", next: "2h após", count: 89, status: "Ativo" },
   { name: "Feedback Pós-Venda", next: "7 dias após", count: 32, status: "Ativo" },
 ];

 export interface RecentLead {
   name: string;
   origin: string;
   responsavel: string;
   etapa: string;
   time: string;
 }
  export const recentLeads: RecentLead[] = [
    { name: "João Silva", origin: "WhatsApp", responsavel: "Renato M.", etapa: "Proposta", time: "Agora" },
    { name: "Beatriz Costa", origin: "Instagram", responsavel: "Ana K.", etapa: "Em Atendimento", time: "10 min atrás" },
    { name: "Marcos Pereira", origin: "Google Ads", responsavel: "Renato M.", etapa: "Novo Contato", time: "25 min atrás" },
    { name: "Clara Nunes", origin: "WhatsApp", responsavel: "Carlos P.", etapa: "Proposta", time: "1h atrás" },
    { name: "Fábio Júnior", origin: "Instagram", responsavel: "Ana K.", etapa: "Novo Contato", time: "2h atrás" },
  ];
 
 export interface Product {
   id: string;
   name: string;
   category: string;
   price: number;
   stock: number;
   imei?: string;
   image?: string;
 }
 
 export const products: Product[] = [
   { id: "1", name: "iPhone 15 Pro Max 256GB", category: "Smartphones", price: 7899.00, stock: 5, imei: "356789123456789" },
   { id: "2", name: "Samsung Galaxy S24 Ultra", category: "Smartphones", price: 6599.00, stock: 3, imei: "356789123456781" },
   { id: "3", name: "Capa Silicone iPhone 15", category: "Acessórios", price: 149.90, stock: 25 },
   { id: "4", name: "Carregador 20W USB-C Apple", category: "Acessórios", price: 199.00, stock: 15 },
   { id: "5", name: "Película de Vidro 3D", category: "Acessórios", price: 59.90, stock: 50 },
   { id: "6", name: "Xiaomi Redmi Note 13", category: "Smartphones", price: 1599.00, stock: 8, imei: "356789123456782" },
 ];
 
 export const kpis = [
   { label: "Vendas do Dia", value: "R$ 12.450", trend: "+12%", sub: "8 vendas hoje", icon: "ShoppingBag", tone: "success" },
   { label: "OS Abertas", value: "14", trend: "+2", sub: "Aguardando peças: 3", icon: "Wrench", tone: "warning" },
   { label: "Estoque Baixo", value: "3", trend: "-1", sub: "Produtos p/ reposição", icon: "Box", tone: "destructive" },
   { label: "Faturamento Mês", value: "R$ 145.800", trend: "+8%", sub: "Meta: 85%", icon: "DollarSign", tone: "primary" },
   { label: "Novos Leads", value: "24", trend: "+5", sub: "Via Instagram/Whats", icon: "Users", tone: "info" },
   { label: "Tickets Médio", value: "R$ 1.550", trend: "+3%", sub: "Média por venda", icon: "TrendingUp", tone: "success" },
 ] as const;

