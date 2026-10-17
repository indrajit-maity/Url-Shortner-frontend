import { useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { LogOut, Menu, X } from "lucide-react";
import clsx from "clsx";
import { useAuth } from "../context/AuhtContext";

export default function Navbar() {
  const { user, isAdmin, logout } = useAuth();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  const links = [
    { to: "/dashboard", label: "My links" },
    ...(isAdmin ? [{ to: "/admin/blocklist", label: "Blocklist" }] : []),
  ];

  const displayName = user?.username ?? user?.email ?? "Account";

  const handleLogout = () => {
    setOpen(false);
    logout();
    navigate("/login", { replace: true });
  };

  const linkClass = ({ isActive }: { isActive: boolean }) =>
    clsx(
      "rounded-md px-3 py-2 text-sm font-medium transition-colors",
      isActive ? "bg-ink text-paper" : "text-ink/70 hover:bg-ink/5 hover:text-ink"
    );

  const logoutButton = (
    <button
      onClick={handleLogout}
      className="flex items-center gap-2 rounded-md border border-line px-3 py-2 text-sm font-medium transition-colors hover:bg-white"
    >
      <LogOut size={16} />
      Log out
    </button>
  );

  return (
    <header className="sticky top-0 z-20 border-b border-line bg-paper/90 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-5xl items-center justify-between px-6">
        {/* Left: logo + desktop links */}
        <div className="flex items-center gap-8">
          <Link to="/dashboard" className="font-display text-2xl font-extrabold tracking-tight">
            snip<span className="text-accent">.</span>
          </Link>

          <nav className="hidden items-center gap-1 md:flex" aria-label="Main">
            {links.map((l) => (
              <NavLink key={l.to} to={l.to} className={linkClass}>
                {l.label}
              </NavLink>
            ))}
          </nav>
        </div>

        {/* Right: user + logout (desktop) */}
        <div className="hidden items-center gap-4 md:flex">
          <span className="max-w-[200px] truncate text-sm text-ink/60">{displayName}</span>
          {logoutButton}
        </div>

        {/* Mobile menu toggle */}
        <button
          className="rounded-md p-2 hover:bg-ink/5 md:hidden"
          onClick={() => setOpen((o) => !o)}
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
        >
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="border-t border-line px-6 py-4 md:hidden">
          <nav className="flex flex-col gap-1" aria-label="Mobile">
            {links.map((l) => (
              <NavLink key={l.to} to={l.to} className={linkClass} onClick={() => setOpen(false)}>
                {l.label}
              </NavLink>
            ))}
          </nav>
          <div className="mt-4 flex items-center justify-between border-t border-line pt-4">
            <span className="truncate text-sm text-ink/60">{displayName}</span>
            {logoutButton}
          </div>
        </div>
      )}
    </header>
  );
}