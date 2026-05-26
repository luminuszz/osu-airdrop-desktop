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

export const extractAndFormatFileNameByPath = (path: string): string => {
	const rawFileName = path.split(/[\\/]/).pop();

	if (!rawFileName) return "unknown-file";

	const lastDotIndex = rawFileName.lastIndexOf(".");

	const hasExtension = lastDotIndex !== -1 && lastDotIndex !== 0;

	const namePart = hasExtension
		? rawFileName.substring(0, lastDotIndex)
		: rawFileName;
	const extensionPart = hasExtension ? rawFileName.substring(lastDotIndex) : "";

	const formattedName = namePart
		.normalize("NFD")
		.replace(/[\u0300-\u036f]/g, "")
		.replace(/[^a-zA-Z0-9\s-]/g, "")
		.trim()
		.replaceAll(/\s+/g, "-")
		.replaceAll(/-+/g, "-")
		.toLowerCase();

	const finalName = formattedName || "unknown-file";

	return `${finalName}${extensionPart.toLowerCase()}`;
};
