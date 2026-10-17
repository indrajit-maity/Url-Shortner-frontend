import { ExternalLink } from "lucide-react";
import CopyButton from "./CopyButton";
import { formatDate, toShortLink } from "../utils/url";
import type { UrlResponse } from "../types";

export default function UrlTable({ urls }: { urls: UrlResponse[] }) {
  // Newest first
  const rows = [...urls].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );

  return (
    <div className="overflow-x-auto rounded-lg border border-line bg-white">
      <table className="w-full min-w-[720px] text-left text-sm">
        <thead className="border-b border-line bg-ink/[0.03] text-ink/60">
          <tr>
            <th className="px-4 py-3 font-medium">Short link</th>
            <th className="px-4 py-3 font-medium">Original link</th>
            <th className="px-4 py-3 text-right font-medium">Clicks</th>
            <th className="px-4 py-3 font-medium">Created</th>
            <th className="px-4 py-3 font-medium">Expires</th>
            <th className="px-4 py-3 font-medium">Status</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((u) => {
            const link = toShortLink(u.shortUrl);
            return (
              <tr key={u.shortUrl} className="border-b border-line last:border-0">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <a
                      href={link}
                      target="_blank"
                      rel="noreferrer"
                      className="max-w-[220px] truncate font-medium text-accent hover:underline"
                      title={link}
                    >
                      {link.replace(/^https?:\/\//, "")}
                    </a>
                    <CopyButton text={link} label="" />
                    <a
                      href={link}
                      target="_blank"
                      rel="noreferrer"
                      aria-label="Open short link"
                      className="rounded-md p-1.5 text-ink/50 hover:bg-ink/5 hover:text-ink"
                    >
                      <ExternalLink size={15} />
                    </a>
                  </div>
                </td>
                <td className="px-4 py-3">
                  <span className="block max-w-[260px] truncate text-ink/70" title={u.originalUrl}>
                    {u.originalUrl}
                  </span>
                </td>
                <td className="px-4 py-3 text-right tabular-nums">{u.count}</td>
                <td className="whitespace-nowrap px-4 py-3 text-ink/70">{formatDate(u.createdAt)}</td>
                <td className="whitespace-nowrap px-4 py-3 text-ink/70">{formatDate(u.expiryDate)}</td>
                <td className="px-4 py-3">
                  <span
                    className={`rounded-full px-2.5 py-1 text-xs font-medium ${
                      u.active ? "bg-accent/10 text-accent" : "bg-ink/10 text-ink/60"
                    }`}
                  >
                    {u.active ? "Active" : "Inactive"}
                  </span>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}