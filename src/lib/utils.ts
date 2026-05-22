import { type ClassValue, clsx } from "clsx";
import { formatDistance } from "date-fns";
import { ptBR } from "date-fns/locale";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

export const formatFileSize = (bytes: number): string => {
	if (bytes === 0) return "0 B";

	const k = 1024;
	const sizes = ["B", "KB", "MB", "GB", "TB"];

	const i = Math.floor(Math.log(bytes) / Math.log(k));

	const fileSize = parseFloat((bytes / Math.pow(k, i)).toFixed(2));

	return `${fileSize} ${sizes[i]}`;
};

export const formatDistanceFromNow = (date: Date): string => {
	return formatDistance(date, new Date(), {
		locale: ptBR,
	}) === "menos de um minuto"
		? "agora"
		: formatDistance(date, new Date(), { locale: ptBR });
};
