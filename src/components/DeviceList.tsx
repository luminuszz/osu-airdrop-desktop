import { Laptop, Monitor, Smartphone, Tablet, Zap } from "lucide-react";
import { useFetchDevices } from "@/hooks/queries/use-fetch-devices";
import { Card } from "./ui/card";

const deviceIcon = (k: string) =>
	k === "phone"
		? Smartphone
		: k === "laptop"
			? Laptop
			: k === "tablet"
				? Tablet
				: Monitor;

export function DeviceList() {
	const { data: devices = [] } = useFetchDevices();

	return (
		<>
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

			<div className="mt-6 hidden lg:block">
				<h3 className="mb-3 px-1 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
					Dispositivos na sala
				</h3>
				<div className="space-y-2">
					{devices?.map((d) => {
						const Icon = deviceIcon("desktop");

						return (
							<Card key={d.id} className="glass flex items-center gap-3 p-3">
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
		</>
	);
}
