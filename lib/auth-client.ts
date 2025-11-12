// Frontend React client for better-auth. This file must NOT import server-side
// modules (Prisma, node:...) because it is required by client components.
// Keep server configuration in `lib/auth.ts`.
import { createAuthClient } from "better-auth/react"

export const authClient = createAuthClient({
    basePath: "/api/auth",
})