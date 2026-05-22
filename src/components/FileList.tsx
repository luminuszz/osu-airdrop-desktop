import { compareDesc } from "date-fns";
import {
	ArrowDownLeft,
	ArrowUpRight,
	FileText,
	Film,
	ImageIcon,
} from "lucide-react";
import { useFetchFiles } from "@/hooks/queries/use-fetch-files";
import { useStorageValue } from "@/hooks/use-storaged";
import { cn, formatDistanceFromNow, formatFileSize } from "@/lib/utils";
import { Card } from "./ui/card";

const fileIcon = (t: string) =>
	t === "img" ? ImageIcon : t === "vid" ? Film : FileText;

export function FileList() {
	const [deviceId] = useStorageValue("deviceId");

	const { data: files } = useFetchFiles();

	return (
		<div className="space-y-2">
			{files
				?.sort((a, b) => compareDesc(a.createdAt, b.createdAt))
				.map((it, index) => {
					const isNew = index === 0;

					const Icon = fileIcon("doc");

					const isOut = it.sender.id === deviceId;

					return (
						<Card
							key={it.id}
							className={cn(
								"glass relative flex items-center gap-3 p-3 transition-smooth hover:border-primary/30 lg:p-4",
								isNew && "border-primary/40 shadow-glow",
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
										{it.originalName}
									</p>
									{isNew && (
										<span className="shrink-0 rounded-full bg-primary/20 px-2 py-0.5 text-[10px] font-bold uppercase text-primary">
											Novo
										</span>
									)}
								</div>
								<p className="truncate text-xs text-muted-foreground">
									{isOut ? "Você enviou" : `De ${it.sender.name}`} ·{" "}
									{formatFileSize(it.size)}
								</p>
							</div>
							<span className="shrink-0 text-[11px] text-muted-foreground lg:text-xs">
								{formatDistanceFromNow(new Date(it.createdAt))}
							</span>
						</Card>
					);
				})}
		</div>
	);
}
