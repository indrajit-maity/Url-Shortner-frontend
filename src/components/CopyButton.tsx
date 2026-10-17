import { useState } from "react";
import { Check, Copy } from "lucide-react";
import toast from "react-hot-toast";

export default function CopyButton({ text, label = "Copy" }: { text: string; label?: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      toast.error("Couldn't copy. Select the link and copy it manually.");
    }
  };

  return (
    <button
      type="button"
      onClick={handleCopy}
      className="flex items-center gap-1.5 rounded-md border border-line bg-white px-2.5 py-1.5 text-sm font-medium transition-colors hover:bg-ink/5"
    >
      {copied ? <Check size={15} className="text-accent" /> : <Copy size={15} />}
      {copied ? "Copied" : label}
    </button>
  );
}