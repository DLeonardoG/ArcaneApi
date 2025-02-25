"use client";

import { logoutUser } from "@/lib/actions/auth";

export function LogoutButton() {
  return (
    <form action={logoutUser}>
      <button type="submit" className="link-button">
        Sign out
      </button>
    </form>
  );