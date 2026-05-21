import { useMutation } from "@tanstack/react-query";
import { hostname, platform } from "@tauri-apps/plugin-os";

import { osuBackend } from "@/lib/api";

export function useRegisterDevice() {
	return useMutation({
		mutationKey: ["/devices"],
		mutationFn: async () => {
			const osName = await hostname();
			const osType = platform();

			const name = `${osName} (${osType})`;

			const { data } = await osuBackend.post<{
				deviceId: string;
				deviceName: string;
			}>("/devices", {
				type: "DESKTOP",
				name,
			});

			localStorage.set("@ousu-airdrop-deviceId", data.deviceId);
			localStorage.set("@ousu-airdrop-deviceName", data.deviceName);
		},
	});
}
