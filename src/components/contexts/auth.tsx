import { useState } from "react";
import { useLoginMutation } from "@/hooks/mutations/use-login";
import { AuthContext } from "@/hooks/use-auth";
import { useToast } from "@/hooks/use-toast";

export function AuthProvider({ children }: { children: React.ReactNode }) {
	const [token, setToken] = useState(() => {
		return localStorage.getItem("@ousu-airdrop-token") ?? "";
	});

	const { toast } = useToast();

	const loginMutation = useLoginMutation({
		onSuccess() {
			toast({ title: "Login successful" });
		},
	});

	async function logout() {
		localStorage.removeItem("@ousu-airdrop-token");
		setToken("");
	}

	async function login(email: string, password: string) {
		const token = await loginMutation.mutateAsync({ email, password });

		console.log({
			token,
		});

		localStorage.setItem("@ousu-airdrop-token", token);
		setToken(token);
	}

	return (
		<AuthContext.Provider
			value={{
				login,
				logout,
				token,
				isPending: loginMutation.isPending,
			}}
		>
			{children}
		</AuthContext.Provider>
	);
}
