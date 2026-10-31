// Client-safe public API. Server-only helpers live in `./server`.
export { LoginForm } from "./components/login-form";
export { SignOutButton } from "./components/sign-out-button";

export { authClient, signIn, signOut, useSession } from "./lib/auth-client";
