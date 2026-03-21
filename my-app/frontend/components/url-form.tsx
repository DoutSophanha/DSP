"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import { LanguageSelector } from "./language-selector";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Checkbox } from "./ui/checkbox";
import { Input } from "./ui/input";
import { Label } from "./ui/label";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000";

export function UrlForm() {
  const router = useRouter();
  const [url, setUrl] = useState("");
  const [sourceLang, setSourceLang] = useState("en");
  const [targetLang, setTargetLang] = useState("km");
  const [generateMp3, setGenerateMp3] = useState(false);
  const [reencodeMp4, setReencodeMp4] = useState(false);
  const [generateTts, setGenerateTts] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await fetch(`${API_BASE_URL}/api/job`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          url,
          source_lang: sourceLang,
          target_lang: targetLang,
          generate_mp3: generateMp3,
          reencode_mp4: reencodeMp4,
          generate_tts: generateTts,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to create job");
      }

      const data = await response.json();
      router.push(`/job/${data.id}`);
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-zinc-100">Start Processing</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={onSubmit} className="space-y-5">
          <div className="space-y-2">
            <Label htmlFor="url" className="text-zinc-300">Video URL</Label>
            <Input
              id="url"
              type="url"
              required
              value={url}
              onChange={(event) => setUrl(event.target.value)}
              placeholder="https://youtube.com/watch?v=..."
            />
          </div>

          <LanguageSelector
            sourceLang={sourceLang}
            targetLang={targetLang}
            onSourceChange={setSourceLang}
            onTargetChange={setTargetLang}
          />

          <div className="grid grid-cols-1 gap-3 rounded-2xl border border-zinc-800 bg-zinc-900/40 p-4 text-sm md:grid-cols-3">
            <div className="flex items-center gap-2">
              <Checkbox id="generateMp3" checked={generateMp3} onCheckedChange={(checked) => setGenerateMp3(Boolean(checked))} />
              <Label htmlFor="generateMp3" className="text-zinc-300">Generate MP3</Label>
            </div>
            <div className="flex items-center gap-2">
              <Checkbox
                id="reencodeMp4"
                checked={reencodeMp4}
                onCheckedChange={(checked) => setReencodeMp4(Boolean(checked))}
              />
              <Label htmlFor="reencodeMp4" className="text-zinc-300">Export MP4</Label>
            </div>
            <div className="flex items-center gap-2">
              <Checkbox id="generateTts" checked={generateTts} onCheckedChange={(checked) => setGenerateTts(Boolean(checked))} />
              <Label htmlFor="generateTts" className="text-zinc-300">Generate TTS</Label>
            </div>
          </div>

          {error ? <p className="text-sm text-destructive">{error}</p> : null}

          <Button type="submit" disabled={loading} className="w-full md:w-auto" size="lg">
            {loading ? "Extracting..." : "Extract Subtitles"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
