import { hostname, platform } from "@tauri-apps/plugin-os";
import { useLoginMutation } from "@/hooks/mutations/use-login";
import { useRegisterDevice } from "@/hooks/mutations/use-register-device";
import { AuthContext } from "@/hooks/use-auth";
import { useStorageValue } from "@/hooks/use-storaged";
import { useToast } from "@/hooks/use-toast";
import { storage } from "@/lib/storage";

export function AuthProvider({ children }: { children: React.ReactNode }) {
	const [token] = useStorageValue("token", "");

	const { toast } = useToast();

	const loginMutation = useLoginMutation({
		onSuccess() {
			toast({ title: "Login successful" });
		},
	});

	const registerMutation = useRegisterDevice();

	async function logout() {
		storage.remove("token");
		storage.remove("deviceId");
		storage.remove("deviceName");
		console.log("logout finoshed");
	}

	async function login(email: string, password: string) {
		const token = await loginMutation.mutateAsync({ email, password });

		storage.set("token", token);

		const osName = await hostname();
		const osType = platform();

		const deviceName = `${osName} (${osType})`;

		const registerDeviceResults =
			await registerMutation.mutateAsync(deviceName);

		storage.set("deviceId", registerDeviceResults.deviceId);
		storage.set("deviceName", registerDeviceResults.deviceName);
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
