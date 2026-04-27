export const sidebarItems = [
  { title: "Painel", url: "/", icon: "LayoutDashboard" as const },
  { title: "Leads", url: "/leads", icon: "Users" as const },
  { title: "Funil de Vendas", url: "/funil", icon: "Filter" as const },
  { title: "Atendimento", url: "/atendimento", icon: "MessageCircle" as const },
  { title: "WhatsApp", url: "/whatsapp", icon: "MessageSquare" as const },
  { title: "Instagram", url: "/instagram", icon: "Instagram" as const },
  { title: "Automação", url: "/automacao", icon: "Workflow" as const },
  { title: "Equipe", url: "/equipe", icon: "UsersRound" as const },
  { title: "Relatórios", url: "/relatorios", icon: "BarChart3" as const },
  { title: "Configurações", url: "/configuracoes", icon: "Settings" as const },
] as const;

export const kpis = [
  { label: "Leads do dia", value: "128", trend: "+18%", sub: "Ontem: 108", icon: "Users", tone: "info" },
  { label: "Conversões", value: "32", trend: "+14%", sub: "Taxa: 25%", icon: "TrendingUp", tone: "success" },
  { label: "Mensagens recebidas", value: "256", trend: "+22%", sub: "Não lidas: 18", icon: "MessageSquare", tone: "primary" },
  { label: "Vendas fechadas", value: "R$ 78.540", trend: "+31%", sub: "Este mês", icon: "DollarSign", tone: "success" },
  { label: "Taxa de resposta", value: "92%", trend: "+7%", sub: "Tempo médio: 2m", icon: "Activity", tone: "warning" },
  { label: "Agendamentos", value: "45", trend: "+12%", sub: "Este mês", icon: "Calendar", tone: "primary" },
] as const;

export const salesData = Array.from({ length: 30 }, (_, i) => {
  const day = i + 1;
  const base = 30000 + Math.sin(i / 3) * 8000 + i * 1500;
  return { day: String(day).padStart(2, "0"), value: Math.round(base + (Math.random() * 4000)) };
});

export const originData = [
  { name: "WhatsApp", value: 576, color: "var(--color-success)" },
  { name: "Instagram", value: 320, color: "oklch(0.65 0.2 330)" },
  { name: "Site / Formulário", value: 192, color: "var(--color-primary)" },
  { name: "Indicações", value: 128, color: "oklch(0.72 0.18 45)" },
  { name: "Outros", value: 64, color: "oklch(0.7 0.02 265)" },
];

export const channelSeries = Array.from({ length: 14 }, (_, i) => ({
  d: i,
  whats: 50 + Math.round(Math.sin(i / 2) * 20 + i * 3 + Math.random() * 10),
  insta: 30 + Math.round(Math.cos(i / 2) * 15 + i * 2 + Math.random() * 8),
}));

export const funnelStages = [
  {
    key: "novo",
    label: "Novo Contato",
    color: "var(--color-info)",
    count: 78,
    total: "R$ 23.400",
    leads: [
      { name: "Ana Paula Lima", channel: "WhatsApp", time: "2 min", avatar: "AP" },
      { name: "Rafael Costa", channel: "Instagram", time: "10 min", avatar: "RC" },
      { name: "Juliana Martins", channel: "WhatsApp", time: "15 min", avatar: "JM" },
    ],
  },
  {
    key: "atendimento",
    label: "Em Atendimento",
    color: "var(--color-warning)",
    count: 54,
    total: "R$ 41.600",
    leads: [
      { name: "Carlos Eduardo", channel: "WhatsApp", time: "5 min", avatar: "CE" },
      { name: "Studio Fit", channel: "Instagram", time: "20 min", avatar: "SF" },
      { name: "Mariana Souza", channel: "WhatsApp", time: "30 min", avatar: "MS" },
    ],
  },
  {
    key: "proposta",
    label: "Proposta",
    color: "var(--color-primary)",
    count: 21,
    total: "R$ 35.200",
    leads: [
      { name: "Beleza & Cia", channel: "Instagram", time: "1 h", avatar: "BC" },
      { name: "Lucas Almeida", channel: "WhatsApp", time: "2 h", avatar: "LA" },
      { name: "Empresa ABC", channel: "WhatsApp", time: "3 h", avatar: "EA" },
    ],
  },
  {
    key: "fechado",
    label: "Fechado",
    color: "var(--color-success)",
    count: 16,
    total: "R$ 78.540",
    leads: [
      { name: "Renato Oliveira", channel: "WhatsApp", time: "1 dia", avatar: "RO", won: true },
      { name: "Patrícia Gomes", channel: "Instagram", time: "2 dias", avatar: "PG", won: true },
      { name: "Clínica Saúde+", channel: "WhatsApp", time: "2 dias", avatar: "CS", won: true },
    ],
  },
];

export const messages = [
  { name: "Juliana Martins", time: "11:32", text: "Olá! Tenho interesse no plano…", channel: "whatsapp", unread: 2 },
  { name: "Studio Fit", time: "11:21", text: "Quero saber mais sobre o serviço…", channel: "instagram", unread: 1 },
  { name: "Carlos Eduardo", time: "11:15", text: "Você: Perfeito! Já envio as informações.", channel: "whatsapp", unread: 0 },
  { name: "Beleza & Cia", time: "10:48", text: "Você: Obrigado pelo contato!", channel: "instagram", unread: 0 },
  { name: "Mariana Souza", time: "10:30", text: "Pode me ajudar com uma dúvida?", channel: "whatsapp", unread: 0 },
];

export const tasks = [
  { text: "Responder leads do WhatsApp", count: 12, done: false },
  { text: "Ligar para 5 leads", count: 5, done: false },
  { text: "Enviar propostas pendentes", count: 3, done: false },
  { text: "Follow-up de orçamentos", count: 7, done: false },
];

export const agenda = [
  { time: "10:00", title: "Reunião com cliente" },
  { time: "11:00", title: "Apresentação de proposta" },
  { time: "14:00", title: "Follow-up de leads" },
];

export const automations = [
  { name: "Follow-up Orçamentos", next: "Amanhã às 09:00", count: 24, status: "Ativo" },
  { name: "Boas-vindas WhatsApp", next: "Hoje às 14:00", count: 56, status: "Ativo" },
  { name: "Reativação de Leads", next: "—", count: 18, status: "Pausado" },
];

export const recentLeads = [
  { name: "Juliana Martins", origin: "WhatsApp", responsavel: "Renato Silva", etapa: "Novo Contato", time: "11:32" },
  { name: "Studio Fit", origin: "Instagram", responsavel: "Ana Clara", etapa: "Em Atendimento", time: "11:21" },
  { name: "Carlos Eduardo", origin: "WhatsApp", responsavel: "Renato Silva", etapa: "Proposta", time: "11:15" },
  { name: "Beleza & Cia", origin: "Instagram", responsavel: "Ana Clara", etapa: "Em Atendimento", time: "10:48" },
];