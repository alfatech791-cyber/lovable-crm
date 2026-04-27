import { useState, useEffect } from "react";
import { evolution } from "@/lib/evolution";
import { X, RefreshCw, AlertCircle, CheckCircle2 } from "lucide-react";
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
  const [status, setStatus] = useState<string>("connecting");

  const fetchQrCode = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await evolution.getQrCode(instanceName);
       if (data.base64 || data.qrcode?.base64) {
         setQrCode(data.base64 || data.qrcode.base64);
      } else if (data.code === "ALREADY_CONNECTED") {
        setStatus("open");
        onSuccess();
      } else {
        setError("Não foi possível gerar o QR Code. Tente novamente.");
      }
    } catch (err) {
      setError("Erro ao buscar QR Code.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQrCode();
    // Polling status
    const interval = setInterval(async () => {
      try {
        const state = await evolution.getInstanceConnection(instanceName);
        if (state.instance?.state === "open") {
          setStatus("open");
          clearInterval(interval);
          toast.success("WhatsApp conectado com sucesso!");
          setTimeout(onSuccess, 2000);
        }
      } catch (e) {
        // ignore
      }
    }, 5000);

    return () => clearInterval(interval);
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

        <div className="p-8 text-center">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-10 space-y-4">
              <RefreshCw className="h-10 w-10 text-primary animate-spin" />
              <p className="text-sm text-muted-foreground">Gerando QR Code...</p>
            </div>
          ) : error ? (
            <div className="flex flex-col items-center justify-center py-10 space-y-4">
              <AlertCircle className="h-10 w-10 text-destructive" />
              <p className="text-sm font-medium">{error}</p>
              <button onClick={fetchQrCode} className="h-9 px-4 rounded-xl bg-primary text-primary-foreground text-sm font-semibold">
                Tentar novamente
              </button>
            </div>
          ) : status === "open" ? (
            <div className="flex flex-col items-center justify-center py-10 space-y-4">
              <div className="h-16 w-16 rounded-full bg-success/20 grid place-items-center">
                <CheckCircle2 className="h-10 w-10 text-success" />
              </div>
              <h4 className="text-lg font-bold">Conectado!</h4>
              <p className="text-sm text-muted-foreground">Sua instância está ativa e pronta para uso.</p>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="bg-white p-4 rounded-2xl inline-block shadow-card border border-border">
                {qrCode && <img src={qrCode} alt="WhatsApp QR Code" className="h-64 w-64" />}
              </div>
              <div className="space-y-2">
                <p className="text-sm font-semibold">Escaneie o código no seu WhatsApp</p>
                <ol className="text-xs text-muted-foreground text-left space-y-1 max-w-[240px] mx-auto list-decimal pl-4">
                  <li>Abra o WhatsApp no seu celular</li>
                  <li>Toque em Dispositivos Conectados</li>
                  <li>Toque em Conectar um Dispositivo</li>
                  <li>Aponte seu celular para esta tela</li>
                </ol>
              </div>
              <button onClick={fetchQrCode} className="inline-flex items-center gap-2 text-xs text-primary font-bold hover:underline">
                <RefreshCw className="h-3.5 w-3.5" /> Atualizar QR Code
              </button>
            </div>
          )}
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
