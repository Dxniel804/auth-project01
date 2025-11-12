import { auth } from "@/lib/auth";
import { toNextJsHandler } from "better-auth/next-js";

const _handler = toNextJsHandler(auth.handler);

export async function GET(request: Request) {
	try {
		return await _handler.GET(request as any);
	} catch (err) {
		console.error('Error in /api/auth GET:', err);
		return new Response(JSON.stringify({ error: String(err) }), { status: 500, headers: { 'Content-Type': 'application/json' } });
	}
}

export async function POST(request: Request) {
	try {
		return await _handler.POST(request as any);
	} catch (err) {
		console.error('Error in /api/auth POST:', err);
		try {
			const copy = request.clone();
			const body = await copy.text();
			console.error('Request body:', body);
		} catch (e) {
			// ignore
		}
		return new Response(JSON.stringify({ error: String(err) }), { status: 500, headers: { 'Content-Type': 'application/json' } });
	}
}