import { useState, useEffect } from "react";
import { evolution } from "@/lib/evolution";
import { X, RefreshCw, AlertCircle, CheckCircle2, ShieldCheck, Smartphone, Zap } from "lucide-react";
import { toast } from "sonner";

interface QrCodeModalProps {
  instanceName: string;
  onClose: () => void;
  onSuccess: () => void;
}

export function QrCodeModal({ instanceName, onClose, onSuccess }: QrCodeModalProps) {
  const [qrCode, setQrCode] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [status, setStatus] = useState<string>("idle");

  const setupAndFetchQrCode = async () => {
    try {
      setLoading(true);
      setError(null);
      console.log(`Iniciando configuração da instância: ${instanceName}`);

      const data = await evolution.getQrCode(instanceName);
      console.log("QR Code Data Received:", data);

      // Cobre todos os formatos: v1 { qrcode: { base64 } }, v2 { base64 }, { code }, raw string
      const base64 =
        data?.base64 ||
        data?.qrcode?.base64 ||
        data?.qrcode ||
        (typeof data === "string" ? data : null);

      const code = data?.code || data?.qrcode?.code;

      if (base64) {
        // garante prefixo data URI
        const src = String(base64).startsWith("data:")
          ? String(base64)
          : `data:image/png;base64,${base64}`;
        setQrCode(src);
      } else if (code && typeof code === "string") {
        // Renderiza via API pública de QR usando o code retornado
        setQrCode(`https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(code)}`);
      } else if (data?.instance?.state === "open" || data?.state === "open") {
        setStatus("open");
        onSuccess();
      } else {
        setError("Não foi possível gerar o QR Code. Tente novamente.");
      }
    } catch (err) {
      console.error(err);
      setError("Erro ao buscar QR Code. Verifique a conexão com a Evolution API.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setupAndFetchQrCode();
    // Auto-refresh do QR a cada 30s (expira) + polling de status a cada 4s
    const refreshInterval = setInterval(() => {
      if (status !== "open") setupAndFetchQrCode();
    }, 30000);

    const statusInterval = setInterval(async () => {
      try {
        const state = await evolution.getInstanceConnection(instanceName);
        const currentState = state.instance?.state || state.state;
        if (currentState === "open") {
          setStatus("open");
          clearInterval(statusInterval);
          clearInterval(refreshInterval);
          toast.success("WhatsApp conectado com sucesso!");
          setTimeout(onSuccess, 2000);
        }
      } catch (e) {
        // ignore
      }
    }, 4000);

    return () => {
      clearInterval(statusInterval);
      clearInterval(refreshInterval);
    };
  }, [instanceName]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-card border border-border w-full max-w-md rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between px-6 py-4 border-b border-border">
          <h3 className="font-display font-bold text-lg">Conectar WhatsApp</h3>
          <button onClick={onClose} className="h-8 w-8 rounded-full hover:bg-muted grid place-items-center transition">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="flex flex-col md:flex-row min-h-[400px]">
          {/* Instruções Lateral */}
          <div className="flex-1 p-8 bg-muted/20 border-r border-border hidden md:flex flex-col justify-center">
            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                  <Smartphone className="h-4 w-4 text-primary" />
                </div>
                <div>
                  <p className="text-sm font-bold">Passo 1</p>
                  <p className="text-xs text-muted-foreground leading-relaxed">Abra o WhatsApp no seu celular e toque no menu ou configurações.</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                  <Zap className="h-4 w-4 text-primary" />
                </div>
                <div>
                  <p className="text-sm font-bold">Passo 2</p>
                  <p className="text-xs text-muted-foreground leading-relaxed">Selecione "Dispositivos Conectados" e depois "Conectar um dispositivo".</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                  <ShieldCheck className="h-4 w-4 text-primary" />
                </div>
                <div>
                  <p className="text-sm font-bold">Configuração Automática</p>
                  <p className="text-xs text-muted-foreground leading-relaxed">Webhooks e disparadores já estão sendo configurados automaticamente para esta instância.</p>
                </div>
              </div>
            </div>
          </div>

          {/* QR Code Área */}
          <div className="flex-1 p-8 flex flex-col items-center justify-center bg-card">
            {loading ? (
              <div className="flex flex-col items-center space-y-4">
                <div className="relative">
                  <div className="h-32 w-32 rounded-3xl border-4 border-primary/20 border-t-primary animate-spin" />
                  <RefreshCw className="absolute inset-0 m-auto h-8 w-8 text-primary/40" />
                </div>
                <p className="text-sm font-bold text-primary animate-pulse">Preparando conexão...</p>
              </div>
            ) : error ? (
              <div className="text-center space-y-4">
                <div className="h-16 w-16 bg-destructive/10 rounded-full flex items-center justify-center mx-auto">
                  <AlertCircle className="h-8 w-8 text-destructive" />
                </div>
                <p className="text-sm font-bold text-destructive">{error}</p>
                <button
                  onClick={setupAndFetchQrCode}
                  className="h-10 px-6 rounded-xl bg-primary text-primary-foreground text-xs font-bold shadow-lg shadow-primary/20 hover:scale-[1.02] transition-all"
                >
                  Tentar Novamente
                </button>
              </div>
            ) : status === "open" ? (
              <div className="text-center space-y-4 animate-in zoom-in-90">
                <div className="h-20 w-20 bg-success/10 rounded-full flex items-center justify-center mx-auto">
                  <CheckCircle2 className="h-12 w-12 text-success" />
                </div>
                <h4 className="text-xl font-black">Conectado!</h4>
                <p className="text-sm text-muted-foreground">O ambiente já está 100% configurado para uso.</p>
              </div>
            ) : (
              <div className="flex flex-col items-center space-y-6 w-full animate-in fade-in slide-in-from-bottom-4">
                <div className="relative group">
                  <div className="absolute -inset-1 bg-gradient-to-r from-primary to-primary-glow rounded-[2rem] blur opacity-25 group-hover:opacity-40 transition duration-1000 group-hover:duration-200" />
                  <div className="relative bg-white p-4 rounded-[1.5rem] shadow-2xl border border-border">
                    {qrCode ? (
                      <img src={qrCode} alt="WhatsApp QR Code" className="h-48 w-48 lg:h-56 lg:w-56" />
                    ) : (
                      <div className="h-48 w-48 flex items-center justify-center bg-muted/50 rounded-xl">
                        <RefreshCw className="h-8 w-8 animate-spin text-muted-foreground" />
                      </div>
                    )}
                  </div>
                </div>
                
                <div className="text-center">
                  <p className="text-xs font-black uppercase tracking-widest text-primary mb-1">Aguardando Leitura</p>
                  <p className="text-[11px] text-muted-foreground font-medium">O código expira em breve</p>
                </div>

                <button
                  onClick={setupAndFetchQrCode}
                  className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-muted-foreground hover:text-primary transition-colors"
                >
                  <RefreshCw className="h-3 w-3" /> Atualizar agora
                </button>
              </div>
            )}
          </div>
        </div>

        <div className="px-6 py-4 bg-muted/30 border-t border-border flex justify-end">
          <button onClick={onClose} className="h-10 px-6 rounded-xl border border-border hover:bg-muted text-sm font-semibold transition">
            Fechar
          </button>
        </div>
      </div>
    </div>
  );
}
