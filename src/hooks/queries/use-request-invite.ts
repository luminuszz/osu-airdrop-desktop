import { useQuery } from "@tanstack/react-query";
import { osuBackend } from "@/lib/api";

export function useRequestInvite() {
	return useQuery({
		refetchInterval: false,
		refetchOnMount: false,
		refetchOnReconnect: false,
		queryKey: ["invite"],
		queryFn: async () => {
			const { data } = await osuBackend.get<{ inviteToken: string }>(
				"/auth/invite",
			);

			return data.inviteToken;
		},
	});
}
