import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { PrismaClient } from "@prisma/client";
import { nextCookies } from "better-auth/next-js";

const prisma = new PrismaClient();

export const auth = betterAuth({
    database: prismaAdapter(prisma, { provider: "sqlite" }),
    emailAndPassword: { enabled: true },
    trustedOrigins: ["http://localhost:3000"],
    plugins: [nextCookies()]
});

// Cliente de autenticação para uso no frontend
// Import the React client from the package export 'better-auth/react'.
// This matches the package.json "exports" field.
import { createAuthClient } from "better-auth/react"

// Frontend React client for better-auth. Uses hooks like `useSession()`.
export const authClient = createAuthClient({
    basePath: "/api/auth",
})