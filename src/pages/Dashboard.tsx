import { useQuery } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import UrlForm from "../components/UrlForm";
import UrlTable from "../components/UrlTable";
import { getMyUrls } from "../api/dashboard.api";
import { getErrorMessage } from "../api/axios";

export default function Dashboard() {
  const { data, isLoading, isError, error, refetch, isFetching } = useQuery({
    queryKey: ["myurls"],
    queryFn: getMyUrls,
  });

  return (
    <div className="space-y-10">
      <UrlForm />

      <section>
        <div className="mb-4 flex items-baseline justify-between">
          <h2 className="font-display text-2xl font-extrabold tracking-tight">My links</h2>
          {data && data.length > 0 && (
            <span className="text-sm text-ink/60">
              {data.length} {data.length === 1 ? "link" : "links"}
            </span>
          )}
        </div>

        {isLoading && (
          <div className="flex items-center gap-2 py-10 text-ink/60">
            <Loader2 size={18} className="animate-spin" />
            Loading your links
          </div>
        )}

        {isError && (
          <div role="alert" className="rounded-md border border-danger/30 bg-danger/5 p-4">
            <p className="text-sm text-danger">{getErrorMessage(error, "Could not load your links")}</p>
            <button
              onClick={() => refetch()}
              disabled={isFetching}
              className="mt-3 rounded-md border border-line bg-white px-3 py-1.5 text-sm font-medium hover:bg-ink/5 disabled:opacity-60"
            >
              Try again
            </button>
          </div>
        )}

        {data && data.length === 0 && (
          <div className="rounded-lg border border-dashed border-line px-6 py-12 text-center">
            <p className="font-medium">No links yet</p>
            <p className="mt-1 text-sm text-ink/60">Paste a link above to create your first short link.</p>
          </div>
        )}

        {data && data.length > 0 && <UrlTable urls={data} />}
      </section>
    </div>
  );
}