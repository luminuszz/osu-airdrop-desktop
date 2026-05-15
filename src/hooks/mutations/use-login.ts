import { useMutation } from "@tanstack/react-query";
import { osuBackend } from "@/lib/api";
import type { MutationOptionsHelper } from "@/lib/react-query";

export async function makeLogin(data: { email: string; password: string }) {
	const response = await osuBackend.post<{ accessToken: string }>(
		"/auth/signin",
		data,
	);

	return response.data.accessToken;
}

export function useLoginMutation(
	options?: MutationOptionsHelper<typeof makeLogin>,
) {
	return useMutation({
		...options,
		mutationFn: makeLogin,
		mutationKey: ["/auth/signin"],
	});
}
