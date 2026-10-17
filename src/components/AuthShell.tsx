import type { ReactNode } from "react";

interface Props {
  title: string;
  subtitle: string;
  children: ReactNode;
  footer: ReactNode;
}

export default function AuthShell({ title, subtitle, children, footer }: Props) {
  return (
    <div className="grid min-h-screen lg:grid-cols-[1.1fr_1fr]">
      {/* Brand panel: a long link collapsing into a short one */}
      <aside className="hidden flex-col justify-between bg-ink p-12 text-paper lg:flex">
        <span className="font-display text-2xl font-extrabold tracking-tight">snip.</span>

        <div className="space-y-8">
          <p className="break-all font-mono text-sm leading-relaxed text-paper/40">
            https://www.example.com/blog/2026/10/how-to-share-a-link-that-is-way-too-long-for-any-message?utm_source=newsletter&utm_medium=email&ref=abc123
          </p>
          <div className="h-px w-24 bg-accent" />
          <p className="font-display text-5xl font-extrabold tracking-tight">
            snip.app/<span className="text-accent">k9Xp2</span>
          </p>
        </div>

        <p className="max-w-sm text-sm text-paper/60">
          Shorten links, share them anywhere, and keep track of every one in your dashboard.
        </p>
      </aside>

      <main className="flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-sm">
          <span className="mb-10 block font-display text-2xl font-extrabold tracking-tight lg:hidden">
            snip.
          </span>
          <h1 className="font-display text-4xl font-extrabold tracking-tight">{title}</h1>
          <p className="mt-2 text-ink/60">{subtitle}</p>
          <div className="mt-8">{children}</div>
          <p className="mt-8 text-sm text-ink/60">{footer}</p>
        </div>
      </main>
    </div>
  );
}