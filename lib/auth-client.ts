type HookHandlers = {
	onSuccess?: (res?: any) => void;
	onRequest?: () => void;
	onResponse?: () => void;
	onError?: (ctx: { error: { message: string } }) => void;
};

async function safeJson(res: Response) {
	try {
		return await res.json();
	} catch {
		return null;
	}
}

export const authClient = {
	signIn: {
		email: async (
			data: { email: string; password: string },
			hooks?: HookHandlers
		) => {
			hooks?.onRequest?.();
			try {
				const res = await fetch("/api/auth", {
					method: "POST",
					headers: { "Content-Type": "application/json" },
					body: JSON.stringify({ action: "signIn", method: "email", ...data }),
				});
				const json = await safeJson(res);
				hooks?.onResponse?.();
				if (!res.ok) {
					hooks?.onError?.({ error: { message: json?.message ?? res.statusText } });
					return;
				}
				hooks?.onSuccess?.(json);
			} catch (err: any) {
				hooks?.onResponse?.();
				hooks?.onError?.({ error: { message: err?.message ?? String(err) } });
			}
		},
	},
	signUp: {
		email: async (
			data: { name?: string; email: string; password: string },
			hooks?: HookHandlers
		) => {
			hooks?.onRequest?.();
			try {
				const res = await fetch("/api/auth", {
					method: "POST",
					headers: { "Content-Type": "application/json" },
					body: JSON.stringify({ action: "signUp", method: "email", ...data }),
				});
				const json = await safeJson(res);
				hooks?.onResponse?.();
				if (!res.ok) {
					hooks?.onError?.({ error: { message: json?.message ?? res.statusText } });
					return;
				}
				hooks?.onSuccess?.(json);
			} catch (err: any) {
				hooks?.onResponse?.();
				hooks?.onError?.({ error: { message: err?.message ?? String(err) } });
			}
		},
	},
};

export default authClient;
