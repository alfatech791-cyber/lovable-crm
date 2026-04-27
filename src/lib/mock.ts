export const sidebarItems = [
  { title: "Painel", url: "/", icon: "LayoutDashboard" as const },
  { title: "Leads", url: "/leads", icon: "Users" as const },
  { title: "Funil de Vendas", url: "/funil", icon: "Filter" as const },
  { title: "Atendimento", url: "/atendimento", icon: "MessageCircle" as const },
  { title: "WhatsApp", url: "/whatsapp", icon: "MessageSquare" as const },
  { title: "Agentes", url: "/agentes", icon: "Headphones" as const },
  { title: "Produtos", url: "/produtos", icon: "ShoppingBag" as const },
  { title: "Instagram", url: "/instagram", icon: "Instagram" as const },
  { title: "Automação", url: "/automacao", icon: "Workflow" as const },
  { title: "Equipe", url: "/equipe", icon: "UsersRound" as const },
  { title: "Relatórios", url: "/relatorios", icon: "BarChart3" as const },
  { title: "Configurações", url: "/configuracoes", icon: "Settings" as const },
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

export const funnelStages = [
  { key: "novo", label: "Novo Contato", color: "var(--color-info)", count: 0, total: "R$ 0", leads: [] },
  { key: "atendimento", label: "Em Atendimento", color: "var(--color-warning)", count: 0, total: "R$ 0", leads: [] },
  { key: "proposta", label: "Proposta", color: "var(--color-primary)", count: 0, total: "R$ 0", leads: [] },
  { key: "fechado", label: "Fechado", color: "var(--color-success)", count: 0, total: "R$ 0", leads: [] },
];

export const messages = [];
export const tasks = [];
export const agenda = [];
export const automations = [];
export const recentLeads = [];
