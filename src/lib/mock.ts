export const sidebarItems = [
  { title: "Painel", url: "/", icon: "LayoutDashboard" as const },
  { title: "Vendas", url: "/vendas", icon: "ShoppingBag" as const },
  { title: "Clientes", url: "/clientes", icon: "Users" as const },
  { title: "Caixa (PDV)", url: "/pdv", icon: "Calculator" as const },
  { title: "Estoque", url: "/estoque", icon: "Box" as const },
  { title: "Serviços (OS)", url: "/servicos", icon: "Wrench" as const },
  { title: "CRM / Leads", url: "/crm", icon: "Zap" as const },
  { title: "Financeiro", url: "/financeiro", icon: "DollarSign" as const },
  { title: "Fiscal", url: "/fiscal", icon: "FileSpreadsheet" as const },
  { title: "Relatórios", url: "/relatorios", icon: "BarChart3" as const },
  {
    title: "Configurações",
    url: "/configuracoes",
    icon: "Settings" as const,
    children: [
      { title: "Equipe", url: "/equipe" },
      { title: "Geral", url: "/configuracoes" },
    ]
  },
] as const;

export const kpis = [
  { label: "Leads do dia", value: "0", trend: "0%", sub: "Aguardando leads", icon: "Users", tone: "info" },
  { label: "Conversões", value: "0", trend: "0%", sub: "Taxa: 0%", icon: "TrendingUp", tone: "success" },
  { label: "Mensagens recebidas", value: "0", trend: "0%", sub: "Nenhuma pendente", icon: "MessageSquare", tone: "primary" },
  { label: "Vendas fechadas", value: "R$ 0", trend: "0%", sub: "Este mês", icon: "DollarSign", tone: "success" },
  { label: "Taxa de resposta", value: "0%", trend: "0%", sub: "Sem dados", icon: "Activity", tone: "warning" },
  { label: "Agendamentos", value: "0", trend: "0%", sub: "Este mês", icon: "Calendar", tone: "primary" },
] as const;

export const salesData = Array.from({ length: 30 }, (_, i) => ({
  day: String(i + 1).padStart(2, "0"),
  value: 0
}));

export const originData = [
  { name: "Aguardando dados", value: 1, color: "var(--color-muted)" },
];

export const channelSeries = Array.from({ length: 14 }, (_, i) => ({
  d: i,
  whats: 0,
  insta: 0,
}));

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
  { key: "novo", label: "Novo Contato", color: "var(--color-info)", count: 0, total: "R$ 0", leads: [] },
  { key: "atendimento", label: "Em Atendimento", color: "var(--color-warning)", count: 0, total: "R$ 0", leads: [] },
  { key: "proposta", label: "Proposta", color: "var(--color-primary)", count: 0, total: "R$ 0", leads: [] },
  { key: "fechado", label: "Fechado", color: "var(--color-success)", count: 0, total: "R$ 0", leads: [] },
];

export interface Message {
  name: string;
  time: string;
  text: string;
  channel: string;
  unread: number;
}
export const messages: Message[] = [];

export interface Task {
  text: string;
  count: number;
  done: boolean;
}
export const tasks: Task[] = [];

export interface AgendaItem {
  time: string;
  title: string;
}
export const agenda: AgendaItem[] = [];

export interface Automation {
  name: string;
  next: string;
  count: number;
  status: string;
}
export const automations: Automation[] = [];

export interface RecentLead {
  name: string;
  origin: string;
  responsavel: string;
  etapa: string;
  time: string;
}
export const recentLeads: RecentLead[] = [];
