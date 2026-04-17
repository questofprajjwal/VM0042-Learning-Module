'use client';

import { useState } from 'react';
import { Copy, Check } from 'lucide-react';

export function CiteListCopyClient({ citations }: { citations: string[] }) {
  const [copied, setCopied] = useState(false);
  const block = citations.join('\n\n');

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(block);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      /* ignore */
    }
  }

  if (citations.length === 0) {
    return (
      <div className="rounded-2xl border border-gt-border-light bg-white p-6 text-center text-sm text-gt-text-muted">
        No factors in this list yet. Add factors while browsing, then return here.
      </div>
    );
  }

  return (
    <button
      type="button"
      onClick={handleCopy}
      className="inline-flex items-center gap-2 rounded-full bg-[#2D6A4F] text-white text-sm font-semibold px-4 py-2"
    >
      {copied ? (
        <>
          <Check className="h-4 w-4" aria-hidden />
          Copied {citations.length} citation{citations.length === 1 ? '' : 's'}
        </>
      ) : (
        <>
          <Copy className="h-4 w-4" aria-hidden />
          Copy all citations (APA)
        </>
      )}
    </button>
  );
}
