import { Loader2, Zap } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/hooks/use-auth";

export function Login() {
	const [email, setEmail] = useState("contato@daviribeiro.com");
	const [password, setPassword] = useState("1234567");

	const { login, isPending } = useAuth();

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();

		if (!email.trim() || !password.trim()) return;

		login(email, password);
	};

	return (
		<main className="min-h-screen flex items-center justify-center px-4 py-10 bg-background">
			<div className="w-full max-w-md">
				<div className="flex flex-col items-center gap-3 mb-8">
					<div className="h-12 w-12 rounded-2xl bg-primary text-primary-foreground flex items-center justify-center">
						<Zap className="h-6 w-6" />
					</div>
					<h1 className="text-2xl font-semibold tracking-tight">
						Bem-vindo de volta
					</h1>
					<p className="text-sm text-muted-foreground">
						Entre para continuar compartilhando arquivos
					</p>
				</div>

				<Card className="p-6 space-y-5">
					<form onSubmit={handleSubmit} className="space-y-4">
						<div className="space-y-2">
							<Label htmlFor="email">E-mail</Label>
							<div className="relative">
								<Input
									id="email"
									type="email"
									placeholder="voce@exemplo.com"
									className="pl-9 h-11"
									value={email}
									onChange={(e) => setEmail(e.target.value)}
									required
								/>
							</div>
						</div>

						<div className="space-y-2">
							<Label htmlFor="password">Senha</Label>
							<div className="flex items-center justify-between"></div>
							<div className="relative">
								<Input
									id="password"
									type="password"
									placeholder="••••••••"
									className="pl-9 h-11 ml-"
									value={password}
									onChange={(e) => setPassword(e.target.value)}
									required
								/>
							</div>
						</div>

						<Button type="submit" className="w-full h-11" disabled={isPending}>
							{isPending ? (
								<Loader2 className="size-5 animate-spin" />
							) : (
								"Entrar"
							)}
						</Button>
					</form>
				</Card>
			</div>
		</main>
	);
}
