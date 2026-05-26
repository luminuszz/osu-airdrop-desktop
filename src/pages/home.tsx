import { c, readFile } from "@tauri-apps/plugin-fs";
import {
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
import { useCallback, useEffect, useState } from "react";
import AddDeviceDialog from "@/components/AddDeviceDialog";
import { FileList } from "@/components/FileList";
import ScanQrDialog from "@/components/ScanQrDialog";
import { Card } from "@/components/ui/card";
import { useFetchDevices } from "@/hooks/queries/use-fetch-devices";
import { useFetchFiles } from "@/hooks/queries/use-fetch-files";
import { useFetchUser } from "@/hooks/queries/use-fetch-user";
import { useAuth } from "@/hooks/use-auth";
import { listenDragAndDrop } from "@/lib/tauri";

type Device = {
	id: string;
	name: string;
	kind: "phone" | "laptop" | "tablet" | "desktop";
	isMe?: boolean;
};

const deviceIcon = (k: Device["kind"]) =>
	k === "phone"
		? Smartphone
		: k === "laptop"
			? Laptop
			: k === "tablet"
				? Tablet
				: Monitor;

export function Home() {
	const { logout } = useAuth();

	const [filesToUpload, setFilesToUpload] = useState<File[]>([]);

	const [addOpen, setAddOpen] = useState(false);
	const [scanOpen, setScanOpen] = useState(false);

	const { data: files } = useFetchFiles();

	const { data: devices } = useFetchDevices();

	const { data: user } = useFetchUser();

	const onFileDrop = useCallback((files: File[]) => {
		setFilesToUpload(files);
	}, []);

	useEffect(() => {
		let destroy: () => void;

		listenDragAndDrop(onFileDrop).then((callback) => (destroy = callback));

		return () => {
			if (destroy) destroy();
		};
	}, [onFileDrop]);

	console.log({
		filesToUpload,
	});

	return (
		<div className="relative mx-auto min-h-screen w-full max-w-md px-5 pb-10 pt-6 lg:max-w-7xl lg:px-10 lg:pt-10">
			<header className="mb-6 flex items-center justify-between lg:mb-10">
				<div className="flex items-center gap-2 lg:gap-3">
					<div className="relative flex h-10 w-10 items-center justify-center rounded-xl bg-green-950 shadow-glow lg:h-12 lg:w-12">
						<Zap
							className="h-5 w-5 text-emerald-600 lg:h-6 lg:w-6"
							fill="currentColor"
						/>
					</div>
					<div className="flex flex-col items-start">
						<h1 className="text-lg font-bold leading-tight lg:text-2xl">
							{user?.name}
						</h1>
						<p className="text-[11px] text-muted-foreground lg:text-xs">
							Sala · {user?.id}
						</p>
					</div>
				</div>
				<div className="flex items-center gap-3">
					<button
						type="button"
						onClick={() => {
							logout();
							console.log("cli");
						}}
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
							<span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-600 opacity-75" />
							<span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-600" />
						</span>
						<span className="text-[11px] font-medium text-success mt-1">
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
										"Envie um arquivo e todos da sala recebem"
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
										{devices?.length}
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

								{devices?.slice(0, 4).map((d, i, arr) => {
									const Icon = deviceIcon("desktop");
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
									onClick={() => logout()}
									className="flex h-12 w-12 items-center justify-center rounded-xl border border-primary/30 bg-primary/10 text-primary transition-smooth hover:bg-primary/20 lg:h-14 lg:w-14"
									aria-label="Adicionar dispositivo"
								>
									<UserPlus className="h-4 w-4 lg:h-5 lg:w-5" />
								</button>
							</div>
						</div>
					</Card>

					<div className="mt-6 hidden lg:block">
						<h3 className="mb-3 px-1 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
							Dispositivos na sala
						</h3>
						<div className="space-y-2">
							{devices?.map((d) => {
								const Icon = deviceIcon("desktop");

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
												{d.type ? "Este dispositivo" : "Online"}
											</p>
										</div>
										{d.type && (
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

				{user && (
					<>
						<AddDeviceDialog
							open={addOpen}
							onOpenChange={setAddOpen}
							roomCode={user.id}
						/>
						<ScanQrDialog
							open={scanOpen}
							onOpenChange={setScanOpen}
							onJoin={() => {}}
						/>
					</>
				)}
				<section>
					<div className="mb-3 flex items-center justify-between px-1">
						<h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
							Arquivos da sala
						</h3>
						<span className="text-[11px] text-muted-foreground">
							{files?.length} arquivos
						</span>
					</div>

					<FileList />
				</section>
			</div>
		</div>
	);
}
