import {
	ArrowDownLeft,
	ArrowUpRight,
	FileText,
	Film,
	Image as ImageIcon,
	Laptop,
	Monitor,
	ScanLine,
	Smartphone,
	Tablet,
	Upload,
	UserPlus,
	Users,
	Zap,
} from "lucide-react";
import { useState } from "react";
import AddDeviceDialog from "@/components/AddDeviceDialog";
import ScanQrDialog from "@/components/ScanQrDialog";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

type Device = {
	id: string;
	name: string;
	kind: "phone" | "laptop" | "tablet" | "desktop";
	isMe?: boolean;
};

type HistoryItem = {
	id: string;
	dir: "in" | "out";
	name: string;
	size: string;
	who: string;
	time: string;
	type: "img" | "vid" | "doc";
	isNew?: boolean;
};

const devices: Device[] = [
	{ id: "me", name: "Você", kind: "phone", isMe: true },
	{ id: "1", name: "iPhone de Ana", kind: "phone" },
	{ id: "2", name: "MacBook Pro", kind: "laptop" },
	{ id: "3", name: "iPad", kind: "tablet" },
	{ id: "4", name: "Galaxy de João", kind: "phone" },
];

const initialHistory: HistoryItem[] = [
	{
		id: "h1",
		dir: "in",
		name: "foto_aniversario.jpg",
		size: "4.8 MB",
		who: "iPhone de Ana",
		time: "Agora",
		type: "img",
		isNew: true,
	},
	{
		id: "h2",
		dir: "out",
		name: "contrato_2025.pdf",
		size: "1.2 MB",
		who: "Você",
		time: "Hoje, 14:32",
		type: "doc",
	},
	{
		id: "h3",
		dir: "in",
		name: "demo.mp4",
		size: "128 MB",
		who: "Galaxy de João",
		time: "Hoje, 11:08",
		type: "vid",
	},
	{
		id: "h4",
		dir: "in",
		name: "planilha.xlsx",
		size: "320 KB",
		who: "iPad",
		time: "Ontem",
		type: "doc",
	},
	{
		id: "h5",
		dir: "in",
		name: "logo_final.png",
		size: "2.1 MB",
		who: "MacBook Pro",
		time: "12 abr",
		type: "img",
	},
];

const deviceIcon = (k: Device["kind"]) =>
	k === "phone"
		? Smartphone
		: k === "laptop"
			? Laptop
			: k === "tablet"
				? Tablet
				: Monitor;

const fileIcon = (t: HistoryItem["type"]) =>
	t === "img" ? ImageIcon : t === "vid" ? Film : FileText;

const App = () => {
	const [history] = useState<HistoryItem[]>(initialHistory);
	const [addOpen, setAddOpen] = useState(false);
	const [scanOpen, setScanOpen] = useState(false);
	const [roomCode, setRoomCode] = useState("BEAM-7K3X");

	return (
		<div className="relative mx-auto min-h-screen w-full max-w-md px-5 pb-10 pt-6 lg:max-w-7xl lg:px-10 lg:pt-10">
			{/* Header */}
			<header className="mb-6 flex items-center justify-between lg:mb-10">
				<div className="flex items-center gap-2 lg:gap-3">
					<div className="relative flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-primary shadow-glow lg:h-12 lg:w-12">
						<Zap
							className="h-5 w-5 text-primary-foreground lg:h-6 lg:w-6"
							fill="currentColor"
						/>
					</div>
					<div>
						<h1 className="text-lg font-bold leading-tight lg:text-2xl">
							Beam
						</h1>
						<p className="text-[11px] text-muted-foreground lg:text-xs">
							Sala · {roomCode}
						</p>
					</div>
				</div>
				<div className="flex items-center gap-3">
					<button
						type="button"
						onClick={() => setAddOpen(true)}
						className="hidden h-10 items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-4 text-sm font-medium text-primary transition-smooth hover:bg-primary/20 lg:flex"
					>
						<UserPlus className="h-4 w-4" />
						Convidar
					</button>
					<button
						type="button"
						onClick={() => setScanOpen(true)}
						className="hidden h-10 items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-4 text-sm font-medium text-primary transition-smooth hover:bg-primary/20 lg:flex"
					>
						<ScanLine className="h-4 w-4" />
						Entrar em sala
					</button>
					<div className="flex items-center gap-1.5 rounded-full border border-success/30 bg-success/10 px-3 py-1.5">
						<span className="relative flex h-2 w-2">
							<span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-success opacity-75" />
							<span className="relative inline-flex h-2 w-2 rounded-full bg-success" />
						</span>
						<span className="text-[11px] font-medium text-success">
							Conectado
						</span>
					</div>
				</div>
			</header>

			<div className="lg:grid lg:grid-cols-[minmax(0,1fr)_minmax(0,1.3fr)] lg:gap-8">
				<section className="mb-6 lg:mb-0">
					<Card className="relative overflow-hidden border-primary/20 bg-gradient-card p-5 lg:p-8">
						<div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-primary/20 blur-3xl lg:h-60 lg:w-60" />
						<div className="absolute -left-10 -bottom-10 h-40 w-40 rounded-full bg-accent/20 blur-3xl lg:h-60 lg:w-60" />

						<div className="relative">
							<div className="mb-4 flex items-center justify-between lg:mb-6">
								<div>
									<h2 className="text-base font-bold lg:text-xl">
										Sala AirDrop
									</h2>
									<p className="text-xs text-muted-foreground lg:text-sm">
										Envie um arquivo e todos da sala recebem
									</p>
								</div>
								<button
									type="button"
									onClick={() => setAddOpen(true)}
									className="flex items-center gap-1.5 rounded-full border border-primary/30 bg-primary/10 px-2.5 py-1 transition-smooth hover:bg-primary/20"
									aria-label="Adicionar dispositivo"
								>
									<Users className="h-3.5 w-3.5 text-primary" />
									<span className="text-[11px] font-semibold text-primary">
										{devices.length}
									</span>
								</button>
							</div>

							<div className="relative mx-auto mb-5 flex h-44 w-44 items-center justify-center lg:mb-8 lg:h-72 lg:w-72">
								<span className="absolute h-full w-full  rounded-full bg-primary/10" />
								<span className="absolute h-2/3 w-2/3  rounded-full bg-primary/15 " />
								<span className="absolute h-1/3 w-1/3 rounded-full bg-primary/20" />
								<div className="relative flex h-16 w-16 items-center justify-center rounded-full bg-gradient-primary shadow-glow lg:h-24 lg:w-24">
									<Zap
										className="h-7 w-7 text-primary-foreground lg:h-10 lg:w-10"
										fill="currentColor"
									/>
								</div>

								{devices
									.filter((d) => !d.isMe)
									.slice(0, 4)
									.map((d, i, arr) => {
										const Icon = deviceIcon(d.kind);
										const angle = (i / arr.length) * Math.PI * 2 - Math.PI / 2;
										const r = 130;
										const x = Math.cos(angle) * r;
										const y = Math.sin(angle) * r;
										return (
											<div
												key={d.id}
												className="absolute hidden h-12 w-12 items-center justify-center rounded-full border border-primary/30 bg-card/80 backdrop-blur transition-smooth hover:border-primary lg:flex"
												style={{ transform: `translate(${x}px, ${y}px)` }}
												title={d.name}
											>
												<Icon className="h-5 w-5 text-primary" />
											</div>
										);
									})}
							</div>

							{/* Actions */}
							<div className="grid grid-cols-[1fr_auto_auto] gap-2 lg:gap-3">
								<button
									type="button"
									className="flex h-12 items-center justify-center gap-2 rounded-xl bg-gradient-primary text-sm font-semibold text-primary-foreground shadow-glow transition-smooth hover:opacity-90 lg:h-14 lg:text-base"
								>
									<Upload className="h-4 w-4 lg:h-5 lg:w-5" />
									Enviar arquivo
								</button>
								<button
									type="button"
									onClick={() => setScanOpen(true)}
									className="flex h-12 w-12 items-center justify-center rounded-xl border border-primary/30 bg-primary/10 text-primary transition-smooth hover:bg-primary/20 lg:h-14 lg:w-14 lg:hidden"
									aria-label="Escanear QR code"
								>
									<ScanLine className="h-4 w-4" />
								</button>
								<button
									type="button"
									onClick={() => setAddOpen(true)}
									className="flex h-12 w-12 items-center justify-center rounded-xl border border-primary/30 bg-primary/10 text-primary transition-smooth hover:bg-primary/20 lg:h-14 lg:w-14"
									aria-label="Adicionar dispositivo"
								>
									<UserPlus className="h-4 w-4 lg:h-5 lg:w-5" />
								</button>
							</div>
						</div>
					</Card>

					{/* Devices list — desktop only */}
					<div className="mt-6 hidden lg:block">
						<h3 className="mb-3 px-1 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
							Dispositivos na sala
						</h3>
						<div className="space-y-2">
							{devices.map((d) => {
								const Icon = deviceIcon(d.kind);
								return (
									<Card
										key={d.id}
										className="glass flex items-center gap-3 p-3"
									>
										<div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-secondary">
											<Icon className="h-5 w-5 text-foreground" />
										</div>
										<div className="min-w-0 flex-1">
											<p className="truncate text-sm font-semibold">{d.name}</p>
											<p className="text-xs text-muted-foreground">
												{d.isMe ? "Este dispositivo" : "Online"}
											</p>
										</div>
										{d.isMe && (
											<span className="rounded-full bg-primary/20 px-2 py-0.5 text-[10px] font-bold uppercase text-primary">
												Você
											</span>
										)}
									</Card>
								);
							})}
						</div>
					</div>
				</section>

				<AddDeviceDialog
					open={addOpen}
					onOpenChange={setAddOpen}
					roomCode={roomCode}
				/>
				<ScanQrDialog
					open={scanOpen}
					onOpenChange={setScanOpen}
					onJoin={setRoomCode}
				/>

				<section>
					<div className="mb-3 flex items-center justify-between px-1">
						<h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
							Arquivos da sala
						</h3>
						<span className="text-[11px] text-muted-foreground">
							{history.length} arquivos
						</span>
					</div>

					<div className="space-y-2">
						{history.map((it) => {
							const Icon = fileIcon(it.type);
							const isOut = it.dir === "out";
							return (
								<Card
									key={it.id}
									className={cn(
										"glass relative flex items-center gap-3 p-3 transition-smooth hover:border-primary/30 lg:p-4",
										it.isNew && "border-primary/40 shadow-glow",
									)}
								>
									<div className="relative flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-secondary lg:h-12 lg:w-12">
										<Icon className="h-5 w-5 text-foreground" />
										<div
											className={cn(
												"absolute -bottom-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full",
												isOut ? "bg-primary" : "bg-accent",
											)}
										>
											{isOut ? (
												<ArrowUpRight className="h-3 w-3 text-primary-foreground" />
											) : (
												<ArrowDownLeft className="h-3 w-3 text-accent-foreground" />
											)}
										</div>
									</div>
									<div className="min-w-0 flex-1">
										<div className="flex items-center gap-2">
											<p className="truncate text-sm font-semibold lg:text-base">
												{it.name}
											</p>
											{it.isNew && (
												<span className="shrink-0 rounded-full bg-primary/20 px-2 py-0.5 text-[10px] font-bold uppercase text-primary">
													Novo
												</span>
											)}
										</div>
										<p className="truncate text-xs text-muted-foreground">
											{isOut ? "Você enviou" : `De ${it.who}`} · {it.size}
										</p>
									</div>
									<span className="shrink-0 text-[11px] text-muted-foreground lg:text-xs">
										{it.time}
									</span>
								</Card>
							);
						})}
					</div>
				</section>
			</div>
		</div>
	);
};

export default App;
