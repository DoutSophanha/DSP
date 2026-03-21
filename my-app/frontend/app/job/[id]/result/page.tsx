"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

import { DownloadButtons } from "../../../../components/download-buttons";
import { SubtitleEditor } from "../../../../components/subtitle-editor";
import { SubtitleWorkspace } from "../../../../components/subtitle-workspace";
import { Card, CardContent, CardHeader, CardTitle } from "../../../../components/ui/card";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000";

type JobResult = {
  id: string;
  status: string;
  files: Record<string, string>;
  available_subtitle_languages: string[];
};

type SubtitlePair = {
  start: string;
  end: string;
  original: string;
  translated: string;
};

export default function JobResultPage() {
  const params = useParams<{ id: string }>();
  const [result, setResult] = useState<JobResult | null>(null);
  const [txtData, setTxtData] = useState("");
  const [subtitlePairs, setSubtitlePairs] = useState<SubtitlePair[]>([]);

  useEffect(() => {
    const fetchResult = async () => {
      const response = await fetch(`${API_BASE_URL}/api/job/${params.id}/result`);
      if (!response.ok) {
        return;
      }
      const data = await response.json();
      setResult(data);

      if (data.files?.txt) {
        const txtResponse = await fetch(
          `${API_BASE_URL}/static-file?path=${encodeURIComponent(data.files.txt)}`,
        );
        if (txtResponse.ok) {
          setTxtData(await txtResponse.text());
        }
      }

      if (data.files?.subtitle_pairs) {
        const pairsResponse = await fetch(
          `${API_BASE_URL}/static-file?path=${encodeURIComponent(data.files.subtitle_pairs)}`,
        );
        if (pairsResponse.ok) {
          const pairsData = await pairsResponse.json();
          if (Array.isArray(pairsData)) {
            setSubtitlePairs(pairsData);
          }
        }
      }
    };

    fetchResult();
  }, [params.id]);

  if (!result) {
    return <p className="text-sm text-zinc-400">Loading result...</p>;
  }

  return (
    <div className="space-y-6">
      <div>
        <p className="text-xs font-medium uppercase tracking-wide text-zinc-400">Output</p>
        <h1 className="mt-1 text-2xl font-semibold tracking-tight text-zinc-100">Result workspace</h1>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Delivery summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3 text-sm md:grid-cols-3">
            <div className="rounded-xl border border-zinc-800 bg-zinc-900/70 p-3">
              <p className="text-xs text-zinc-400">Job</p>
              <p className="mt-1 font-mono text-xs text-zinc-200">{result.id}</p>
            </div>
            <div className="rounded-xl border border-zinc-800 bg-zinc-900/70 p-3">
              <p className="text-xs text-zinc-400">Status</p>
              <p className="mt-1 font-medium text-zinc-200">{result.status}</p>
            </div>
            <div className="rounded-xl border border-zinc-800 bg-zinc-900/70 p-3">
              <p className="text-xs text-zinc-400">Languages</p>
              <p className="mt-1 font-medium text-zinc-200">{result.available_subtitle_languages.join(", ") || "N/A"}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <DownloadButtons files={result.files} />

      {subtitlePairs.length ? <SubtitleWorkspace subtitlePairs={subtitlePairs} /> : null}

      <SubtitleEditor initialTxt={txtData} />
    </div>
  );
}
