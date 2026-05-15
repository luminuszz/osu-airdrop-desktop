import { createContext, useContext, useState } from "react";
import { useLoginMutation } from "./mutations/use-login";
import { useToast } from "./use-toast";

export type AuthContextType = {
	login: (email: string, password: string) => Promise<void>;
	logout: () => Promise<void>;
	token: string | undefined;
	isPending: boolean;
};

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

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

export function useAuth() {
	return useContext(AuthContext);
}
