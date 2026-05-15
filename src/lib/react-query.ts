import type { UseMutationOptions } from "@tanstack/react-query";
import { QueryClient } from "@tanstack/react-query";
import type { AxiosError } from "axios";

export type MutationOptionsHelper<
	T extends (...args: any[]) => Promise<any>,
	TError = AxiosError,
> = Omit<
	UseMutationOptions<Awaited<ReturnType<T>>, TError, Parameters<T>[0]>,
	"mutationFn"
>;

export const queryClient = new QueryClient();
