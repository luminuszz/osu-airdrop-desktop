import { useAuth } from "./hooks/use-auth";
import { Home } from "./pages/home";
import { Login } from "./pages/login";

export function App() {
	const { token } = useAuth();

	return token ? <Home /> : <Login />;
}
