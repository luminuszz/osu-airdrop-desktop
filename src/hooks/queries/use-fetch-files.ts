import { useQuery } from "@tanstack/react-query";
import { osuBackend } from "@/lib/api";

export enum DeviceType {
	MOBILE = "MOBILE",
	DESKTOP = "DESKTOP",
	WEB = "WEB",
}

export interface Device {
	id: string;
	name: string;
	type: DeviceType | string;
	isOnline: boolean;
	lastActiveAt: string | Date;
	createdAt: string | Date;
	userId: string;
}

export interface FileResponse {
	id: string;
	originalName: string;
	mimeType: string;
	size: number;
	sender: Device;
	createdAt: string;
}

export type FileListResponse = FileResponse[];

export const fetchFilesQueryKey = ["/files"] as const;

export function useFetchFiles() {
	return useQuery({
		queryKey: fetchFilesQueryKey,
		queryFn: async () => {
			const { data } = await osuBackend.get<FileListResponse>("/files");

			return data;
		},
	});
}
