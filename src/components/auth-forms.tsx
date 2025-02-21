"use client";

import { useActionState } from "react";
import Link from "next/link";
import { loginUser, registerUser } from "@/lib/actions/auth";

type AuthState = { error?: string } | undefined;

export function LoginForm() {
  const [state, action, pending] = useActionState(
    async (_prev: AuthState, formData: FormData) => loginUser(formData),
    undefined,
  );

  return (
    <form className="form-stack panel" action={action}>
      <label>
        Email
        <input name="email" type="email" required />
      </label>
      <label>
        Password
        <input name="password" type="password" required minLength={6} />
      </label>
      {state?.error ? <p className="form-error">{state.error}</p> : null}
      <button className="btn btn-primary" type="submit" disabled={pending}>
        {pending ? "Signing in..." : "Sign in"}
      </button>
      <p style={{ color: "var(--muted)", margin: 0 }}>
        No account? <Link href="/register">Join LoreVault</Link>
      </p>
    </form>
  );
}

export function RegisterForm() {
  const [state, action, pending] = useActionState(
    async (_prev: AuthState, formData: FormData) => registerUser(formData),
    undefined,
  );

  return (
    <form className="form-stack panel" action={action}>
      <label>
        Display name
        <input name="name" required minLength={2} />
      </label>
      <label>
        Email
        <input name="email" type="email" required />
      </label>
      <label>
        Password
        <input name="password" type="password" required minLength={6} />
      </label>
      {state?.error ? <p className="form-error">{state.error}</p> : null}
      <button className="btn btn-primary" type="submit" disabled={pending}>
        {pending ? "Creating..." : "Create account"}
      </button>
      <p style={{ color: "var(--muted)", margin: 0 }}>
        Already in? <Link href="/login">Sign in</Link>
      </p>
    </form>
  );
}
