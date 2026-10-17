import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation } from "@tanstack/react-query";
import { Loader2, ShieldBan, Trash2 } from "lucide-react";
import toast from "react-hot-toast";
import FormField from "../components/FormField";
import { addToBlocklist, removeFromBlocklist } from "../api/admin.api";
import { getErrorMessage } from "../api/axios";
import { isValidLink } from "../utils/domain";
import type { AddBlocklistResponse, BlocklistSource } from "../types";

const SOURCES: { value: BlocklistSource; label: string }[] = [
  { value: "MANUAL", label: "Manual" },
  { value: "THIRD_PARTY", label: "Third party" },
  { value: "AUTO_REPORTED", label: "Auto reported" },
];

const sourceLabel = (s: BlocklistSource) => SOURCES.find((x) => x.value === s)?.label ?? s;

// The list shows the domain the backend extracted, so match a typed link to it by hostname.
const hostOf = (value: string) => {
  try {
    return new URL(value.trim()).hostname.replace(/^www\./, "").toLowerCase();
  } catch {
    return value.trim().toLowerCase();
  }
};

const linkRule = z
  .string()
  .trim()
  .min(1, "Enter a link")
  .refine(isValidLink, "Enter a full link, starting with http:// or https://");

const addSchema = z.object({
  domain: linkRule,
  reason: z.string().trim().min(1, "Give a reason for blocking this domain"),
  blocklistSource: z.enum(["MANUAL", "THIRD_PARTY", "AUTO_REPORTED"]),
});
type AddValues = z.infer<typeof addSchema>;

const removeSchema = z.object({ domain: linkRule });
type RemoveValues = z.infer<typeof removeSchema>;

export default function AdminBlocklist() {
  // The API has no "list" endpoint, so this only tracks domains blocked in this session.
  const [added, setAdded] = useState<AddBlocklistResponse[]>([]);

  const addForm = useForm<AddValues>({
    resolver: zodResolver(addSchema),
    defaultValues: { domain: "", reason: "", blocklistSource: "MANUAL" },
  });

  const removeForm = useForm<RemoveValues>({ resolver: zodResolver(removeSchema) });

  const addMutation = useMutation({
    mutationFn: addToBlocklist,
    onSuccess: (entry) => {
      setAdded((prev) => [entry, ...prev.filter((e) => e.domain !== entry.domain)]);
      toast.success(`${entry.domain} is now blocked`);
      addForm.reset({ domain: "", reason: "", blocklistSource: "MANUAL" });
    },
    onError: (err) => toast.error(getErrorMessage(err, "Could not block that domain")),
  });

  const removeMutation = useMutation({
    mutationFn: removeFromBlocklist,
    onSuccess: (_d, sent) => {
      const host = hostOf(sent);
      setAdded((prev) => prev.filter((e) => e.domain !== sent && e.domain.toLowerCase() !== host));
      toast.success(`${host} is no longer blocked`);
      removeForm.reset();
    },
    onError: (err) => toast.error(getErrorMessage(err, "Could not unblock that domain")),
  });

  const confirmRemove = (value: string) => {
    if (!window.confirm(`Unblock ${hostOf(value)}? People will be able to shorten links to it again.`)) return;
    removeMutation.mutate(value);
  };

  // Send the link exactly as typed. The backend extracts the domain.
  const onAdd = (v: AddValues) =>
    addMutation.mutate({
      domain: v.domain,
      reason: v.reason,
      blocklistSource: v.blocklistSource,
    });

  const onRemove = (v: RemoveValues) => confirmRemove(v.domain);

  const { errors: addErrors } = addForm.formState;
  const { errors: removeErrors } = removeForm.formState;

  return (
    <div className="space-y-8">
      <header>
        <h1 className="font-display text-3xl font-extrabold tracking-tight">Blocklist</h1>
        <p className="mt-2 max-w-xl text-ink/60">
          Blocked domains can't be shortened. Paste a full link and the server picks out its domain.
        </p>
      </header>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Block */}
        <section className="rounded-lg border border-line bg-white p-6">
          <h2 className="flex items-center gap-2 font-display text-xl font-extrabold tracking-tight">
            <ShieldBan size={20} className="text-accent" />
            Block a domain
          </h2>

          <form onSubmit={addForm.handleSubmit(onAdd)} className="mt-5 space-y-4" noValidate>
            <FormField
              label="Link"
              placeholder="https://www.evil-site.com/login?id=5"
              autoComplete="off"
              error={addErrors.domain?.message}
              {...addForm.register("domain")}
            />
            <FormField
              label="Reason"
              placeholder="Phishing, spam, malware..."
              autoComplete="off"
              error={addErrors.reason?.message}
              {...addForm.register("reason")}
            />

            <div>
              <label htmlFor="blocklistSource" className="mb-1.5 block text-sm font-medium">
                Source
              </label>
              <select
                id="blocklistSource"
                className="w-full rounded-md border border-line bg-white px-3.5 py-2.5 outline-none transition-colors focus:border-accent focus:ring-2 focus:ring-accent/20"
                {...addForm.register("blocklistSource")}
              >
                {SOURCES.map((s) => (
                  <option key={s.value} value={s.value}>
                    {s.label}
                  </option>
                ))}
              </select>
            </div>

            <button
              type="submit"
              disabled={addMutation.isPending}
              className="flex items-center gap-2 rounded-md bg-accent px-4 py-2.5 font-medium text-white transition-colors hover:bg-accent-dark focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent disabled:opacity-60"
            >
              {addMutation.isPending && <Loader2 size={18} className="animate-spin" />}
              Block domain
            </button>
          </form>
        </section>

        {/* Unblock */}
        <section className="rounded-lg border border-line bg-white p-6">
          <h2 className="flex items-center gap-2 font-display text-xl font-extrabold tracking-tight">
            <Trash2 size={20} className="text-danger" />
            Unblock a domain
          </h2>

          <form onSubmit={removeForm.handleSubmit(onRemove)} className="mt-5 space-y-4" noValidate>
            <FormField
              label="Link"
              placeholder="https://www.evil-site.com/login?id=5"
              autoComplete="off"
              error={removeErrors.domain?.message}
              {...removeForm.register("domain")}
            />
            <button
              type="submit"
              disabled={removeMutation.isPending}
              className="flex items-center gap-2 rounded-md bg-danger px-4 py-2.5 font-medium text-white transition-colors hover:bg-danger/90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-danger disabled:opacity-60"
            >
              {removeMutation.isPending && <Loader2 size={18} className="animate-spin" />}
              Unblock domain
            </button>
          </form>
        </section>
      </div>

      {/* Session list */}
      <section>
        <h2 className="mb-3 font-display text-xl font-extrabold tracking-tight">Blocked in this session</h2>

        {added.length === 0 ? (
          <p className="rounded-lg border border-dashed border-line px-6 py-8 text-center text-sm text-ink/60">
            Domains you block now will appear here. The full list lives on the server.
          </p>
        ) : (
          <ul className="divide-y divide-line rounded-lg border border-line bg-white">
            {added.map((e) => (
              <li key={e.id} className="flex flex-wrap items-center justify-between gap-3 px-4 py-3">
                <div className="min-w-0">
                  <p className="truncate font-medium">{e.domain}</p>
                  <p className="truncate text-sm text-ink/60">{e.reason}</p>
                </div>
                <div className="flex items-center gap-3">
                  <span className="rounded-full bg-ink/10 px-2.5 py-1 text-xs font-medium text-ink/70">
                    {sourceLabel(e.blocklistSource)}
                  </span>
                  <button
                    onClick={() => confirmRemove(e.domain)}
                    disabled={removeMutation.isPending}
                    className="rounded-md border border-line px-3 py-1.5 text-sm font-medium hover:bg-ink/5 disabled:opacity-60"
                  >
                    Unblock
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}