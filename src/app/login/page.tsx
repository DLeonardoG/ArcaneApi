import type { Metadata } from "next";
import { LoginForm } from "@/components/auth-forms";

export const metadata: Metadata = {
  title: "Sign in",
};

export default function LoginPage() {
  return (
    <div className="shell">
      <div className="page-hero">
        <h1>Sign in</h1>
        <p>Return to your shelf of favorites.</p>
      </div>
      <LoginForm />
    </div>
  );
}
