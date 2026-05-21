import { useMutation } from "@tanstack/react-query";

import { osuBackend } from "@/lib/api";
import type { MutationOptionsHelper } from "@/lib/react-query";

export async function registerDevice(deviceName: string) {
	const { data } = await osuBackend.post<{
		deviceId: string;
		deviceName: string;
	}>("/devices", {
		type: "DESKTOP",
		name: deviceName,
	});

	return data;
}

export function useRegisterDevice(
	options?: MutationOptionsHelper<typeof registerDevice>,
) {
	return useMutation({
		...options,
		mutationFn: registerDevice,
		mutationKey: ["/devices"],
	});
}
