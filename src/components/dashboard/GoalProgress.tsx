import { Target, TrendingUp, Edit2, Save, X, Calendar, Trophy, Zap, Activity } from "lucide-react";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface GoalProgressProps {
  current: number;
  goal?: number;
  onGoalUpdate?: () => void;
}

export function GoalProgress({ current, goal: initialGoal = 50000, onGoalUpdate }: GoalProgressProps) {
  const { user } = useAuth();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [goals, setGoals] = useState({
    daily: 0,
    weekly: 0,
    monthly: initialGoal,
    type: 'revenue' as 'revenue' | 'units' | 'profit'
  });
  const [editGoals, setEditGoals] = useState({ ...goals });

  useEffect(() => {
    if (user?.id) {
      fetchGoals();
    }
  }, [user?.id]);

  const fetchGoals = async () => {
    const { data, error } = await supabase
      .from('business_goals')
      .select('daily_goal, weekly_goal, monthly_goal, goal_type')
      .eq('user_id', user?.id || '')
      .maybeSingle();

    if (data) {
      const fetchedGoals = {
        daily: Number(data.daily_goal) || 0,
        weekly: Number(data.weekly_goal) || 0,
        monthly: Number(data.monthly_goal) || initialGoal,
        type: (data.goal_type as any) || 'revenue'
      };
      setGoals(fetchedGoals);
      setEditGoals(fetchedGoals);
    }
  };

  const handleSave = async () => {
    if (!user?.id) return;
    setIsLoading(true);
    try {
      const { error } = await supabase
        .from('business_goals')
        .upsert({
          user_id: user.id,
          daily_goal: editGoals.daily,
          weekly_goal: editGoals.weekly,
          monthly_goal: editGoals.monthly,
          goal_type: editGoals.type,
          updated_at: new Date().toISOString()
        });

      if (error) throw error;

      setGoals({ ...editGoals });
      setIsModalOpen(false);
      toast.success("Metas atualizadas com sucesso!");
      if (onGoalUpdate) onGoalUpdate();
    } catch (error) {
      console.error("Erro ao salvar metas:", error);
      toast.error("Erro ao salvar metas");
    } finally {
      setIsLoading(false);
    }
  };

  const pct = Math.min(100, Math.round((current / (goals.monthly || 1)) * 100));
  const remaining = Math.max(0, (goals.monthly || 0) - current);
  const dayOfMonth = new Date().getDate();
  const daysInMonth = new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0).getDate();
  const expectedPct = Math.round((dayOfMonth / daysInMonth) * 100);
  const onTrack = pct >= expectedPct;

  // SVG ring
  const radius = 56;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (pct / 100) * circumference;

  return (
    <>
      <div 
        onClick={() => setIsModalOpen(true)}
        className="rounded-2xl bg-card border border-border p-5 shadow-card relative overflow-hidden cursor-pointer hover:ring-2 hover:ring-primary/20 transition-all group"
      >
        <div className="absolute -top-10 -right-10 h-32 w-32 rounded-full opacity-10 blur-2xl bg-gradient-primary" />
        <div className="flex items-center justify-between mb-4 relative">
          <div>
            <h3 className="text-[15px] font-semibold flex items-center gap-2">
              <Target className="h-4 w-4 text-primary" />
              Meta do Mês
            </h3>
            <p className="text-[11px] text-muted-foreground mt-0.5">
              {dayOfMonth} de {daysInMonth} dias decorridos
            </p>
          </div>
          <div className="flex items-center gap-2">
            <span className={`text-[10px] font-semibold px-2 py-1 rounded-full ${onTrack ? "bg-success/15 text-success" : "bg-warning/15 text-[oklch(0.55_0.15_75)]"}`}>
              {onTrack ? "No ritmo" : "Atrasado"}
            </span>
            <Edit2 className="h-3 w-3 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
          </div>
        </div>

        <div className="flex items-center gap-4 relative min-w-0">
          <div className="relative h-[120px] w-[120px] sm:h-[130px] sm:w-[130px] shrink-0">
          <svg className="w-full h-full -rotate-90" viewBox="0 0 140 140">
            <defs>
              <linearGradient id="goalGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="var(--color-primary)" />
                <stop offset="100%" stopColor="oklch(0.65 0.2 330)" />
              </linearGradient>
            </defs>
            <circle cx="70" cy="70" r={radius} stroke="var(--color-muted)" strokeWidth="10" fill="none" />
            <circle
              cx="70"
              cy="70"
              r={radius}
              stroke="url(#goalGrad)"
              strokeWidth="10"
              fill="none"
              strokeLinecap="round"
              strokeDasharray={circumference}
              strokeDashoffset={offset}
              style={{ transition: "stroke-dashoffset 1s ease-out" }}
            />
          </svg>
          <div className="absolute inset-0 grid place-items-center text-center">
            <div>
              <div className="text-[28px] font-bold font-display tracking-tight bg-gradient-primary bg-clip-text text-transparent">
                {pct}%
              </div>
              <div className="text-[10px] text-muted-foreground">atingido</div>
            </div>
          </div>
        </div>

        <div className="flex-1 min-w-0 space-y-3">
          <div className="min-w-0">
            <div className="text-[11px] text-muted-foreground">Realizado</div>
            <div className="text-base sm:text-lg font-bold font-display truncate">
              {goals.type === 'units' 
                ? `${current} un.` 
                : current.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}
            </div>
          </div>
          <div className="min-w-0">
            <div className="text-[11px] text-muted-foreground">Meta ({goals.type === 'revenue' ? 'Faturamento' : goals.type === 'units' ? 'Aparelhos' : 'Lucro'})</div>
            <div className="text-xs sm:text-sm font-semibold text-foreground/70 truncate">
              {goals.type === 'units'
                ? `${goals.monthly} un.`
                : (goals.monthly || 0).toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}
            </div>
          </div>
          <div className="pt-2 border-t border-border min-w-0">
            <div className="text-[11px] text-muted-foreground flex items-center gap-1">
              <TrendingUp className="h-3 w-3" /> Faltam
            </div>
            <div className="text-[13px] font-semibold text-primary truncate">
              {goals.type === 'units'
                ? `${remaining} un.`
                : remaining.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}
            </div>
          </div>
        </div>
      </div>
      </div>

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <div className="flex items-center gap-3 mb-2">
              <div className="h-12 w-12 rounded-2xl bg-primary/10 grid place-items-center">
                <Trophy className="h-6 w-6 text-primary" />
              </div>
              <div>
                <DialogTitle className="text-xl font-bold">Definição de Metas</DialogTitle>
                <DialogDescription>Ajuste seus objetivos de vendas diários, semanais e mensais.</DialogDescription>
              </div>
            </div>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="space-y-4">
              <div className="grid gap-2">
                <Label className="text-sm font-bold">Tipo de Meta</Label>
                <div className="grid grid-cols-3 gap-2">
                  <Button 
                    type="button"
                    variant={editGoals.type === 'revenue' ? 'default' : 'outline'}
                    className="text-xs h-9"
                    onClick={() => setEditGoals({ ...editGoals, type: 'revenue' })}
                  >
                    Faturamento
                  </Button>
                  <Button 
                    type="button"
                    variant={editGoals.type === 'units' ? 'default' : 'outline'}
                    className="text-xs h-9"
                    onClick={() => setEditGoals({ ...editGoals, type: 'units' })}
                  >
                    Aparelhos
                  </Button>
                  <Button 
                    type="button"
                    variant={editGoals.type === 'profit' ? 'default' : 'outline'}
                    className="text-xs h-9"
                    onClick={() => setEditGoals({ ...editGoals, type: 'profit' })}
                  >
                    Lucro
                  </Button>
                </div>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="daily" className="text-sm font-bold flex items-center gap-2">
                  <Zap className="h-4 w-4 text-warning" />
                  Meta Diária
                </Label>
                <div className="relative">
                  {editGoals.type !== 'units' && <span className="absolute left-3 top-2.5 text-muted-foreground text-sm">R$</span>}
                  <Input
                    id="daily"
                    type="number"
                    value={editGoals.daily}
                    onChange={(e) => setEditGoals({ ...editGoals, daily: Number(e.target.value) })}
                    className={`${editGoals.type !== 'units' ? 'pl-9' : 'pl-3'} bg-muted/30 border-border/50 font-bold`}
                  />
                  {editGoals.type === 'units' && <span className="absolute right-3 top-2.5 text-muted-foreground text-sm">un.</span>}
                </div>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="weekly" className="text-sm font-bold flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-info" />
                  Meta Semanal
                </Label>
                <div className="relative">
                  {editGoals.type !== 'units' && <span className="absolute left-3 top-2.5 text-muted-foreground text-sm">R$</span>}
                  <Input
                    id="weekly"
                    type="number"
                    value={editGoals.weekly}
                    onChange={(e) => setEditGoals({ ...editGoals, weekly: Number(e.target.value) })}
                    className={`${editGoals.type !== 'units' ? 'pl-9' : 'pl-3'} bg-muted/30 border-border/50 font-bold`}
                  />
                  {editGoals.type === 'units' && <span className="absolute right-3 top-2.5 text-muted-foreground text-sm">un.</span>}
                </div>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="monthly" className="text-sm font-bold flex items-center gap-2">
                  <Target className="h-4 w-4 text-primary" />
                  Meta Mensal
                </Label>
                <div className="relative">
                  {editGoals.type !== 'units' && <span className="absolute left-3 top-2.5 text-muted-foreground text-sm">R$</span>}
                  <Input
                    id="monthly"
                    type="number"
                    value={editGoals.monthly}
                    onChange={(e) => setEditGoals({ ...editGoals, monthly: Number(e.target.value) })}
                    className={`${editGoals.type !== 'units' ? 'pl-9' : 'pl-3'} bg-muted/30 border-border/50 font-bold`}
                  />
                  {editGoals.type === 'units' && <span className="absolute right-3 top-2.5 text-muted-foreground text-sm">un.</span>}
                </div>
              </div>
            </div>

            <div className="bg-primary/5 rounded-xl p-4 border border-primary/10 mt-2">
              <div className="flex items-center gap-2 mb-2">
                <Activity className="h-4 w-4 text-primary" />
                <h4 className="text-xs font-bold uppercase tracking-wider text-primary">Progresso Atual</h4>
              </div>
              <div className="flex justify-between items-end">
                <div>
                  <p className="text-[10px] text-muted-foreground uppercase font-bold">Realizado este mês</p>
                  <p className="text-lg font-black text-foreground">
                    {editGoals.type === 'units' 
                      ? `${current} un.` 
                      : current.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-[10px] text-muted-foreground uppercase font-bold">Faltam</p>
                  <p className="text-sm font-bold text-primary">
                    {editGoals.type === 'units'
                      ? `${remaining} un.`
                      : remaining.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <DialogFooter className="flex gap-2 sm:gap-0">
            <Button variant="outline" onClick={() => setIsModalOpen(false)} className="flex-1 sm:flex-none">
              <X className="h-4 w-4 mr-2" />
              Cancelar
            </Button>
            <Button onClick={handleSave} disabled={isLoading} className="flex-1 sm:flex-none">
              {isLoading ? (
                <Activity className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <Save className="h-4 w-4 mr-2" />
              )}
              Salvar Metas
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
