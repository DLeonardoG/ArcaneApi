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