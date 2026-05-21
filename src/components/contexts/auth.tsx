import { useLoginMutation } from "@/hooks/mutations/use-login";
import { AuthContext } from "@/hooks/use-auth";
import { useStorageValue } from "@/hooks/use-storaged";
import { useToast } from "@/hooks/use-toast";
import { storage } from "@/lib/storage";

export function AuthProvider({ children }: { children: React.ReactNode }) {
	const [token, setToken] = useStorageValue("token", "");

	const { toast } = useToast();

	const loginMutation = useLoginMutation({
		onSuccess() {
			toast({ title: "Login successful" });
		},
	});

	async function logout() {
		storage.remove("token");
		storage.remove("deviceId");
		storage.remove("deviceName");
		console.log("logout finoshed");
	}

	async function login(email: string, password: string) {
		const token = await loginMutation.mutateAsync({ email, password });
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
