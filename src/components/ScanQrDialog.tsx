import { useEffect, useRef, useState } from "react";
import { BrowserQRCodeReader, IScannerControls } from "@zxing/browser";
import { ScanLine, CameraOff, Keyboard, Check } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "@/hooks/use-toast";

type Props = {
  open: boolean;
  onOpenChange: (o: boolean) => void;
  onJoin: (roomCode: string) => void;
};

const extractRoom = (raw: string): string | null => {
  if (!raw) return null;
  try {
    const url = new URL(raw);
    const fromQuery = url.searchParams.get("room");
    if (fromQuery) return fromQuery.toUpperCase();
  } catch {
    /* not a URL */
  }
  const match = raw.match(/[A-Z0-9]{4,}-?[A-Z0-9]{2,}/i);
  return match ? match[0].toUpperCase() : raw.toUpperCase();
};

const ScanQrDialog = ({ open, onOpenChange, onJoin }: Props) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const controlsRef = useRef<IScannerControls | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [manualMode, setManualMode] = useState(false);
  const [manualCode, setManualCode] = useState("");

  useEffect(() => {
    if (!open || manualMode) return;
    let cancelled = false;
    setError(null);

    const reader = new BrowserQRCodeReader();
    (async () => {
      try {
        const controls = await reader.decodeFromVideoDevice(
          undefined,
          videoRef.current!,
          (result) => {
            if (cancelled || !result) return;
            const code = extractRoom(result.getText());
            if (code) {
              controls.stop();
              onJoin(code);
              toast({ title: "Conectado!", description: `Sala ${code}` });
              onOpenChange(false);
            }
          },
        );
        controlsRef.current = controls;
      } catch (e) {
        console.error(e);
        setError("Não foi possível acessar a câmera. Permita o acesso ou digite o código.");
      }
    })();

    return () => {
      cancelled = true;
      controlsRef.current?.stop();
      controlsRef.current = null;
    };
  }, [open, manualMode, onJoin, onOpenChange]);

  const handleManualJoin = () => {
    const code = extractRoom(manualCode.trim());
    if (!code) return;
    onJoin(code);
    toast({ title: "Conectado!", description: `Sala ${code}` });
    onOpenChange(false);
    setManualCode("");
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(o) => {
        if (!o) {
          controlsRef.current?.stop();
          setManualMode(false);
          setManualCode("");
        }
        onOpenChange(o);
      }}
    >
      <DialogContent className="max-w-sm border-primary/20 bg-gradient-card">
        <DialogHeader>
          <div className="mx-auto mb-2 flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-primary shadow-glow">
            <ScanLine className="h-5 w-5 text-primary-foreground" />
          </div>
          <DialogTitle className="text-center">Entrar em uma sala</DialogTitle>
          <DialogDescription className="text-center">
            {manualMode
              ? "Digite o código da sala"
              : "Aponte a câmera para o QR code do outro dispositivo"}
          </DialogDescription>
        </DialogHeader>

        {!manualMode ? (
          <div className="space-y-3">
            <div className="relative aspect-square overflow-hidden rounded-2xl border border-primary/20 bg-background">
              {error ? (
                <div className="flex h-full flex-col items-center justify-center gap-2 px-6 text-center">
                  <CameraOff className="h-8 w-8 text-muted-foreground" />
                  <p className="text-xs text-muted-foreground">{error}</p>
                </div>
              ) : (
                <>
                  <video
                    ref={videoRef}
                    className="h-full w-full object-cover"
                    muted
                    playsInline
                  />
                  {/* Scan frame */}
                  <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
                    <div className="relative h-2/3 w-2/3">
                      <span className="absolute left-0 top-0 h-6 w-6 border-l-2 border-t-2 border-primary" />
                      <span className="absolute right-0 top-0 h-6 w-6 border-r-2 border-t-2 border-primary" />
                      <span className="absolute bottom-0 left-0 h-6 w-6 border-b-2 border-l-2 border-primary" />
                      <span className="absolute bottom-0 right-0 h-6 w-6 border-b-2 border-r-2 border-primary" />
                    </div>
                  </div>
                </>
              )}
            </div>

            <Button
              variant="outline"
              className="h-11 w-full"
              onClick={() => {
                controlsRef.current?.stop();
                setManualMode(true);
              }}
            >
              <Keyboard className="h-4 w-4" />
              Digitar código
            </Button>
          </div>
        ) : (
          <div className="space-y-3">
            <Input
              autoFocus
              placeholder="BEAM-XXXX"
              value={manualCode}
              onChange={(e) => setManualCode(e.target.value.toUpperCase())}
              onKeyDown={(e) => e.key === "Enter" && handleManualJoin()}
              className="h-12 text-center text-lg font-bold tracking-[0.2em]"
            />
            <div className="grid grid-cols-2 gap-2">
              <Button variant="outline" className="h-11" onClick={() => setManualMode(false)}>
                <ScanLine className="h-4 w-4" />
                Escanear
              </Button>
              <Button
                onClick={handleManualJoin}
                disabled={!manualCode.trim()}
                className="h-11 bg-gradient-primary shadow-glow"
              >
                <Check className="h-4 w-4" />
                Entrar
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default ScanQrDialog;
