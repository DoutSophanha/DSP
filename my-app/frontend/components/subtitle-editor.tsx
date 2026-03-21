"use client";

import { useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";

type Props = {
  initialTxt: string;
};

export function SubtitleEditor({ initialTxt }: Props) {
  const [value, setValue] = useState(initialTxt);

  const lineCount = useMemo(() => value.split("\n").length, [value]);

  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between text-sm text-zinc-400">
          <CardTitle className="text-sm text-zinc-100">Subtitle Preview / Editor</CardTitle>
          <span>{lineCount} lines</span>
        </div>
      </CardHeader>
      <CardContent>
        <textarea
          value={value}
          onChange={(event) => setValue(event.target.value)}
          className="h-80 w-full rounded-xl border border-zinc-700 bg-zinc-900 p-3 font-mono text-sm text-zinc-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400 focus-visible:ring-offset-2 focus-visible:ring-offset-zinc-950"
        />
      </CardContent>
    </Card>
  );
}
