import { useQuery } from "@tanstack/react-query";
import { osuBackend } from "@/lib/api";

export interface UserResponse {
	name: string;
	id: string;
	email: string;
}

export async function fetchUser() {
	const { data } = await osuBackend.get<UserResponse>("/auth/me");

	return data;
}

export function useFetchUser() {
	return useQuery({
		queryKey: ["/auth/me"],
		queryFn: fetchUser,
	});
}
