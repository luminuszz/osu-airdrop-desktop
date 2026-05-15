import { Check, Copy, QrCode, Share2 } from "lucide-react";
import { QRCodeSVG } from "qrcode.react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { toast } from "@/hooks/use-toast";

type Props = {
	open: boolean;
	onOpenChange: (o: boolean) => void;
	roomCode: string;
};

const AddDeviceDialog = ({ open, onOpenChange, roomCode }: Props) => {
	const [copied, setCopied] = useState(false);
	const joinUrl = `${window.location.origin}/?room=${roomCode}`;

	const handleCopy = async () => {
		await navigator.clipboard.writeText(joinUrl);
		setCopied(true);
		toast({
			title: "Link copiado!",
			description: "Cole no outro dispositivo.",
		});
		setTimeout(() => setCopied(false), 2000);
	};

	const handleShare = async () => {
		if (navigator.share) {
			try {
				await navigator.share({
					title: "Entrar na sala Beam",
					text: `Entre na minha sala AirDrop: ${roomCode}`,
					url: joinUrl,
				});
			} catch {
				/* canceled */
			}
		} else {
			handleCopy();
		}
	};

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent className="max-w-sm border-primary/20 bg-gradient-card">
				<DialogHeader>
					<div className="mx-auto mb-2 flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-primary shadow-glow">
						<QrCode className="h-5 w-5 text-primary-foreground" />
					</div>
					<DialogTitle className="text-center">
						Adicionar dispositivo
					</DialogTitle>
					<DialogDescription className="text-center">
						Escaneie o QR code com o outro dispositivo para entrar na sala
					</DialogDescription>
				</DialogHeader>

				{/* QR Code */}
				<div className="my-2 flex justify-center">
					<div className="rounded-2xl bg-primary-foreground p-4 shadow-elevated">
						<QRCodeSVG
							value={joinUrl}
							size={208}
							level="M"
							bgColor="transparent"
							fgColor="#0b1020"
						/>
					</div>
				</div>

				{/* Room code */}
				<div className="rounded-xl border border-border bg-secondary/50 p-3 text-center">
					<p className="text-[11px] uppercase tracking-wider text-muted-foreground">
						Código da sala
					</p>
					<p className="mt-1 text-2xl font-bold tracking-[0.2em] text-gradient">
						{roomCode}
					</p>
				</div>

				{/* Actions */}
				<div className="grid grid-cols-2 gap-2">
					<Button variant="outline" onClick={handleCopy} className="h-11">
						{copied ? (
							<Check className="h-4 w-4" />
						) : (
							<Copy className="h-4 w-4" />
						)}
						{copied ? "Copiado" : "Copiar link"}
					</Button>
					<Button
						onClick={handleShare}
						className="h-11 bg-gradient-primary shadow-glow"
					>
						<Share2 className="h-4 w-4" />
						Compartilhar
					</Button>
				</div>
			</DialogContent>
		</Dialog>
	);
};

export default AddDeviceDialog;
