export const sidebarItems = [
    { title: "Início", url: "/", icon: "Home" as const },
    { title: "Agendamentos", url: "/agendamentos", icon: "Calendar" as const },
   { 
     title: "Vendas", 
     url: "/vendas", 
     icon: "ShoppingBag" as const,
     children: [
       { title: "PDV (Caixa)", url: "/pdv" },
       { title: "Orçamentos", url: "/vendas/orcamentos" },
       { title: "Histórico", url: "/vendas/historico" },
       { title: "Consulta Estoque", url: "/vendas/consulta-estoque" },
       { title: "Calculadora Aparelhos", url: "/vendas/calculadora" },
       { title: "Simulador Cartão", url: "/vendas/simulador" },
       { title: "Delivery", url: "/vendas/delivery" },
       { title: "Garantias", url: "/vendas/garantias" },
     ]
   },
   { title: "Clientes", url: "/clientes", icon: "Users" as const },
   { 
     title: "Estoque", 
     url: "/estoque", 
     icon: "Box" as const,
     children: [
       { title: "Estoque Atual", url: "/estoque/atual" },
       { title: "Ordens de Compra", url: "/estoque/compras" },
       { title: "Produtos Vendidos", url: "/estoque/vendidos" },
       { title: "Movimentações", url: "/estoque/movimentacoes" },
       { title: "Etiquetas", url: "/estoque/etiquetas" },
     ]
   },
   { 
     title: "Ordem de Serviço", 
     url: "/servicos", 
     icon: "Wrench" as const,
     children: [
       { title: "Dashboard OS", url: "/servicos/dashboard" },
       { title: "Nova OS", url: "/servicos/nova" },
       { title: "Técnicos", url: "/servicos/tecnicos" },
       { title: "Checklists", url: "/servicos/checklists" },
       { title: "Termos Garantia", url: "/servicos/termos" },
     ]
   },
    { title: "Gestão WhatsApp", url: "/whatsapp", icon: "MessageSquare" as const },
   { 
     title: "Financeiro", 
     url: "/financeiro", 
     icon: "DollarSign" as const,
     children: [
       { title: "Caixa/Bancos", url: "/financeiro/caixa" },
       { title: "Fornecedores", url: "/financeiro/fornecedores" },
       { title: "Plano de Contas", url: "/financeiro/plano-contas" },
       { title: "DRE", url: "/financeiro/dre" },
       { title: "Maquininhas POS", url: "/financeiro/maquininhas" },
     ]
   },
   { title: "Relatórios", url: "/relatorios", icon: "BarChart3" as const },
   { 
     title: "Operação", 
     url: "/operacao", 
     icon: "Settings2" as const,
     children: [
       { title: "Tipos de Produtos", url: "/operacao/tipos-produtos" },
       { title: "Transportadores", url: "/operacao/transportadores" },
       { title: "Maquininhas POS", url: "/operacao/maquininhas" },
       { title: "Serviços", url: "/servicos/lista" },
       { title: "Modelos Etiquetas", url: "/estoque/etiquetas" },
     ]
   },
   {
     title: "Configurações",
     url: "/configuracoes",
     icon: "Settings" as const,
     children: [
       { title: "Equipe", url: "/equipe" },
       { title: "Geral", url: "/configuracoes" },
       { title: "Parâmetros", url: "/configuracoes/parametros" },
     ]
   },
] as const;

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

