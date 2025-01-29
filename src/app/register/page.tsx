import type { Metadata } from "next";
import { RegisterForm } from "@/components/auth-forms";

export const metadata: Metadata = {
  title: "Join",
};

export default function RegisterPage() {
  return (
    <div className="shell">