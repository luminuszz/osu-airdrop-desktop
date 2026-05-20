import { useQuery } from "@tanstack/react-query";
import { osuBackend } from "@/lib/api";

export interface Device {
	id: string;
	name: string;
	type: string;
}

export function useFetchDevices() {
	return useQuery({
		queryKey: ["/devices"],
		queryFn: async () => {
			const { data } = await osuBackend.get<Device[]>("/devices");

			return data;
		},
	});
}
