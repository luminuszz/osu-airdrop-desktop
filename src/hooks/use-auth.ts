import { createContext, useContext } from "react";

export type AuthContextType = {
	login: (email: string, password: string) => Promise<void>;
	logout: () => Promise<void>;
	token: string | undefined;
	isPending: boolean;
};

export const AuthContext = createContext<AuthContextType>(
	{} as AuthContextType,
);

export function useAuth() {
	return useContext(AuthContext);
}
