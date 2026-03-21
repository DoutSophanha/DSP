"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Button } from "../../../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../../../components/ui/card";
import { Progress } from "../../../components/ui/progress";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000";

type JobStatus = {
  id: string;
  status: string;
  progress: number;
  step: string;
  error?: string;
};

export default function JobStatusPage() {
  const params = useParams<{ id: string }>();
  const [job, setJob] = useState<JobStatus | null>(null);

  useEffect(() => {
    const interval = setInterval(async () => {
      const response = await fetch(`${API_BASE_URL}/api/job/${params.id}`);
      if (response.ok) {
        const data = await response.json();
        setJob(data);
      }
    }, 2000);

    return () => clearInterval(interval);
  }, [params.id]);

  return (
    <div className="space-y-6">
      <div>
        <p className="text-xs font-medium uppercase tracking-wide text-zinc-400">Processing</p>
        <h1 className="mt-1 text-2xl font-semibold tracking-tight text-zinc-100">Job status</h1>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Pipeline execution</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-3 text-sm md:grid-cols-3">
            <div className="rounded-xl border border-zinc-800 bg-zinc-900/70 p-3">
              <p className="text-xs text-zinc-400">Job ID</p>
              <p className="mt-1 font-mono text-xs text-zinc-200">{params.id}</p>
            </div>
            <div className="rounded-xl border border-zinc-800 bg-zinc-900/70 p-3">
              <p className="text-xs text-zinc-400">Status</p>
              <p className="mt-1 font-medium text-zinc-200">{job?.status ?? "loading"}</p>
            </div>
            <div className="rounded-xl border border-zinc-800 bg-zinc-900/70 p-3">
              <p className="text-xs text-zinc-400">Current Step</p>
              <p className="mt-1 font-medium text-zinc-200">{job?.step ?? "-"}</p>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <p className="text-zinc-400">Progress</p>
              <p className="font-medium text-zinc-100">{job?.progress ?? 0}%</p>
            </div>
            <Progress value={job?.progress ?? 0} />
          </div>

          {job?.error ? <p className="text-sm text-destructive">{job.error}</p> : null}

          {job?.status === "completed" ? (
            <Button asChild>
              <Link href={`/job/${params.id}/result`}>Open result workspace</Link>
            </Button>
          ) : null}
        </CardContent>
      </Card>
    </div>
  );
}
