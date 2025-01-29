import type { Metadata } from "next";
import { RegisterForm } from "@/components/auth-forms";

export const metadata: Metadata = {
  title: "Join",
};

export default function RegisterPage() {
  return (
    <div className="shell">
      <div className="page-hero">
        <h1>Join LoreVault</h1>
        <p>Save favorites and, if you earn the quill, edit the archive.</p>
      </div>
      <RegisterForm />