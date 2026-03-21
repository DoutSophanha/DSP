"use client";

import { motion } from "framer-motion";
import { useMemo, useState } from "react";

import {
  buildDownloadSrtUrl,
  buildDownloadTxtUrl,
  extractSubtitles,
  generateTTS,
  resolveStaticUrl,
  SubtitleSegment,
  translateSubtitles,
} from "../../services/dsp-api";
import { Button } from "../ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Input } from "../ui/input";

const transition = { duration: 0.25 };

export function SubtitleToolWorkspace() {
  const [url, setUrl] = useState("");
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [sourceLang, setSourceLang] = useState("en");
  const [targetLang, setTargetLang] = useState("km");
  const [originalRows, setOriginalRows] = useState<SubtitleSegment[]>([]);
  const [translatedRows, setTranslatedRows] = useState<SubtitleSegment[]>([]);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const [isExtracting, setIsExtracting] = useState(false);
  const [isTranslating, setIsTranslating] = useState(false);
  const [isGeneratingTts, setIsGeneratingTts] = useState(false);

  const isExtracted = originalRows.length > 0;
  const isTranslated = translatedRows.length > 0;

  const canTranslate = isExtracted && !isExtracting && !isTranslating;
  const canGenerateTts = (isTranslated || isExtracted) && !isGeneratingTts;

  const rightPanelRows = useMemo(() => translatedRows, [translatedRows]);

  const handleExtract = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!url.trim()) {
      setError("Please provide a valid YouTube URL");
      return;
    }

    setIsExtracting(true);
    setError(null);
    setAudioUrl(null);
    setTranslatedRows([]);

    try {
      const result = await extractSubtitles(url, sourceLang);
      setSessionId(result.session_id);
      setOriginalRows(result.subtitles);
    } catch (extractError) {
      setOriginalRows([]);
      setSessionId(null);
      setError(extractError instanceof Error ? extractError.message : "Failed to extract subtitles");
    } finally {
      setIsExtracting(false);
    }
  };

  const handleTranslate = async () => {
    if (!canTranslate) {
      return;
    }

    setIsTranslating(true);
    setError(null);

    try {
      const result = await translateSubtitles({
        sessionId: sessionId ?? undefined,
        subtitles: originalRows,
        sourceLang,
        targetLang,
      });
      setTranslatedRows(result.subtitles);
    } catch (translateError) {
      setError(translateError instanceof Error ? translateError.message : "Failed to translate subtitles");
    } finally {
      setIsTranslating(false);
    }
  };

  const handleGenerateTts = async () => {
    if (!canGenerateTts) {
      return;
    }

    setIsGeneratingTts(true);
    setError(null);

    try {
      const result = await generateTTS({
        sessionId: sessionId ?? undefined,
        subtitles: translatedRows.length ? translatedRows : originalRows,
      });

      if (result.session_id && !sessionId) {
        setSessionId(result.session_id);
      }

      setAudioUrl(resolveStaticUrl(result.audio_url));
    } catch (ttsError) {
      setError(ttsError instanceof Error ? ttsError.message : "Failed to generate TTS");
    } finally {
      setIsGeneratingTts(false);
    }
  };

  return (
    <div className="space-y-5">
      <motion.section initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={transition}>
        <h1 className="text-2xl font-semibold tracking-tight text-zinc-100">Subtitle Tool</h1>
        <p className="mt-1 text-sm text-zinc-500">Extract, translate, and export subtitles with a focused production workflow.</p>
      </motion.section>

      <motion.section initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={transition}>
        <Card>
          <CardContent className="p-5 md:p-6">
            <form onSubmit={handleExtract} className="mx-auto flex max-w-3xl flex-col gap-3 md:flex-row">
              <Input
                value={url}
                onChange={(event) => setUrl(event.target.value)}
                type="url"
                placeholder="Paste YouTube URL..."
                className="h-12 text-base"
                disabled={isExtracting}
              />
              <select
                value={sourceLang}
                onChange={(event) => setSourceLang(event.target.value)}
                className="h-12 rounded-xl border border-zinc-800 bg-zinc-900/80 px-3 text-sm text-zinc-100 outline-none"
                disabled={isExtracting}
              >
                <option value="en">English</option>
                <option value="km">Khmer</option>
              </select>
              <Button type="submit" size="lg" className="md:min-w-44" disabled={isExtracting}>
                {isExtracting ? "Extracting..." : "Extract Subtitles"}
              </Button>
            </form>
            {error ? <p className="mx-auto mt-3 max-w-3xl rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-2 text-sm text-red-300">{error}</p> : null}
          </CardContent>
        </Card>
      </motion.section>

      <motion.section
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ ...transition, delay: 0.05 }}
        className="grid gap-4 lg:grid-cols-2"
      >
        <motion.div whileHover={{ y: -3 }} transition={transition}>
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base text-zinc-100">Original subtitles</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="max-h-[22rem] space-y-3 overflow-y-auto pr-1">
                {isExtracted ? (
                  originalRows.map((row) => (
                    <article
                      key={`${row.start}-${row.end}-${row.text}`}
                      className="space-y-1 rounded-lg border border-zinc-800 bg-zinc-900/60 p-3"
                    >
                      <p className="font-mono text-[11px] text-zinc-500">[{row.start}]</p>
                      <p className="text-sm leading-6 text-zinc-200">{row.text}</p>
                    </article>
                  ))
                ) : (
                  <p className="rounded-lg border border-dashed border-zinc-700 bg-zinc-900/30 p-4 text-sm text-zinc-500">
                    Extract subtitles to preview original transcript.
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div whileHover={{ y: -3 }} transition={transition}>
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base text-zinc-100">Translated subtitles</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="max-h-[22rem] space-y-3 overflow-y-auto pr-1">
                {rightPanelRows.length ? (
                  rightPanelRows.map((row) => (
                    <article
                      key={`${row.start}-${row.end}-${row.text}`}
                      className="space-y-1 rounded-lg border border-zinc-800 bg-zinc-900/60 p-3"
                    >
                      <p className="font-mono text-[11px] text-zinc-500">[{row.start}]</p>
                      <p className="text-sm leading-6 text-zinc-200">{row.text}</p>
                    </article>
                  ))
                ) : (
                  <p className="rounded-lg border border-dashed border-zinc-700 bg-zinc-900/30 p-4 text-sm text-zinc-500">
                    Run translation to generate Khmer / English output.
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </motion.section>

      {isExtracted ? (
        <motion.section
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={transition}
          className="sticky bottom-4"
        >
          <Card className="bg-zinc-950/95 backdrop-blur-xl">
            <CardContent className="flex flex-wrap items-center gap-2 p-3">
              <select
                value={targetLang}
                onChange={(event) => setTargetLang(event.target.value)}
                className="h-9 rounded-lg border border-zinc-800 bg-zinc-900/80 px-3 text-sm text-zinc-100 outline-none"
                disabled={isTranslating || isExtracting}
              >
                <option value="km">Khmer</option>
                <option value="en">English</option>
              </select>
              <Button type="button" size="sm" onClick={handleTranslate} disabled={!canTranslate}>
                {isTranslating ? "Translating..." : "Translate"}
              </Button>

              <a
                href={sessionId ? buildDownloadSrtUrl(sessionId, isTranslated ? "translated" : "original") : "#"}
                target="_blank"
                rel="noreferrer"
              >
                <Button type="button" size="sm" variant="outline" disabled={!sessionId}>
                  Download SRT
                </Button>
              </a>

              <a
                href={sessionId ? buildDownloadTxtUrl(sessionId, isTranslated ? "translated" : "original") : "#"}
                target="_blank"
                rel="noreferrer"
              >
                <Button type="button" size="sm" variant="outline" disabled={!sessionId}>
                  Download TXT
                </Button>
              </a>

              <Button type="button" size="sm" variant="outline" onClick={handleGenerateTts} disabled={!canGenerateTts}>
                {isGeneratingTts ? "Generating TTS..." : "Generate TTS"}
              </Button>

              <a href={audioUrl ?? "#"} target="_blank" rel="noreferrer">
                <Button type="button" size="sm" variant="outline" disabled={!audioUrl}>
                  Download Audio
                </Button>
              </a>

              {audioUrl ? (
                <audio controls className="h-9 rounded-lg">
                  <source src={audioUrl} />
                </audio>
              ) : null}
            </CardContent>
          </Card>
        </motion.section>
      ) : null}
    </div>
  );
}
