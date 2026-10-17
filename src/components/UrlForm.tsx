import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ExternalLink, Loader2 } from "lucide-react";
import toast from "react-hot-toast";
import FormField from "./FormField";
import CopyButton from "./CopyButton";
import { createShortUrl } from "../api/urls.api";
import { getErrorMessage } from "../api/axios";
import { formatDate, toShortLink } from "../utils/url";
import type { UrlResponse } from "../types";

const todayStr = () => {
  const d = new Date();
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
};

const schema = z.object({
  originalUrl: z
    .string()
    .min(1, "Paste the link you want to shorten")
    .max(2048, "The link can be at most 2048 characters")
    .url("Enter a full link, starting with http:// or https://"),
  expiryDate: z
    .string()
    .optional()
    .refine((v) => !v || v >= todayStr(), "Pick today or a later date"),
});
type FormValues = z.infer<typeof schema>;

export default function UrlForm() {
  const queryClient = useQueryClient();
  const [created, setCreated] = useState<UrlResponse | null>(null);
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormValues>({ resolver: zodResolver(schema) });

  const mutation = useMutation({
    mutationFn: createShortUrl,
    onSuccess: (data) => {
      setCreated(data);
      setServerError(null);
      reset();
      queryClient.invalidateQueries({ queryKey: ["myurls"] });
      toast.success("Short link created");
    },
    onError: (err) => {
      setCreated(null);
      setServerError(getErrorMessage(err, "Could not create the short link"));
    },
  });

  const onSubmit = (values: FormValues) => {
    setServerError(null);
    mutation.mutate({
      originalUrl: values.originalUrl.trim(),
      ...(values.expiryDate ? { expiryDate: values.expiryDate } : {}),
    });
  };

  const shortLink = created ? toShortLink(created.shortUrl) : "";

  return (
    <section className="rounded-lg border border-line bg-white p-6">
      <h2 className="font-display text-xl font-extrabold tracking-tight">Shorten a link</h2>

      <form onSubmit={handleSubmit(onSubmit)} className="mt-5 space-y-4" noValidate>
        <FormField
          label="Link to shorten"
          placeholder="https://example.com/a-very-long-page"
          autoComplete="off"
          error={errors.originalUrl?.message}
          {...register("originalUrl")}
        />

        <div className="flex flex-col gap-4 sm:flex-row sm:items-end">
          <div className="sm:w-56">
            <FormField
              label="Expires on (optional)"
              type="date"
              min={todayStr()}
              error={errors.expiryDate?.message}
              {...register("expiryDate")}
            />
          </div>
          <button
            type="submit"
            disabled={mutation.isPending}
            className="flex items-center justify-center gap-2 rounded-md bg-accent px-5 py-2.5 font-medium text-white transition-colors hover:bg-accent-dark focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent disabled:opacity-60 sm:ml-auto"
          >
            {mutation.isPending && <Loader2 size={18} className="animate-spin" />}
            Shorten link
          </button>
        </div>
      </form>

      {serverError && (
        <p role="alert" className="mt-5 rounded-md border border-danger/30 bg-danger/5 px-4 py-3 text-sm text-danger">
          {serverError}
        </p>
      )}

      {created && (
        <div className="mt-5 rounded-md border border-accent/30 bg-accent/5 p-4">
          <p className="text-sm text-ink/60">Your short link</p>
          <div className="mt-1 flex flex-wrap items-center justify-between gap-3">
            <a
              href={shortLink}
              target="_blank"
              rel="noreferrer"
              className="break-all font-display text-xl font-extrabold text-accent hover:underline"
            >
              {shortLink}
            </a>
            <div className="flex items-center gap-2">
              <CopyButton text={shortLink} />
              <a
                href={shortLink}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-1.5 rounded-md border border-line bg-white px-2.5 py-1.5 text-sm font-medium transition-colors hover:bg-ink/5"
              >
                <ExternalLink size={15} />
                Open
              </a>
            </div>
          </div>
          <p className="mt-2 text-sm text-ink/60">Expires: {formatDate(created.expiryDate)}</p>
        </div>
      )}
    </section>
  );
}