import Link from "next/link";
import type { Session } from "next-auth";
import { auth } from "@/auth";
import { LogoutButton } from "@/components/logout-button";

export async function SiteHeader() {
  let session: Session | null = null;
  try {
    session = await auth();
  } catch {
    session = null;
  }

  return (
    <header className="site-header">
      <div className="site-header__inner">
        <Link href="/" className="brand">
          LoreVault
        </Link>
        <nav className="nav">
          <Link href="/universes">Universes</Link>
          <Link href="/search">Search</Link>
          {session?.user ? (
            <>
              <Link href="/profile">Profile</Link>
              {(session.user.role === "EDITOR" ||
                session.user.role === "ADMIN") && (
                <Link href="/studio">Studio</Link>
              )}
              <LogoutButton />
            </>
          ) : (
            <>
              <Link href="/login">Sign in</Link>
              <Link href="/register" className="nav-cta">
                Join
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
