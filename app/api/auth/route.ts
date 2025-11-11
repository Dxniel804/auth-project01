import { auth } from "@/lib/auth";
import { toNextJsHandler } from "better-auth/next-js";

const _handler = toNextJsHandler(auth.handler);
export const GET = _handler.GET;
export const POST = _handler.POST;