import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";

type Props = {
  files: Record<string, string>;
};

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000";

const labelByFormat: Record<string, string> = {
  srt: "Download SRT",
  vtt: "Download VTT",
  txt: "Download TXT",
  mp3: "Download MP3",
  mp4: "Download MP4",
  tts: "Download TTS",
};

export function DownloadButtons({ files }: Props) {
  const entries = Object.entries(files).filter(([key]) =>
    ["srt", "vtt", "txt", "mp3", "mp4", "tts"].includes(key),
  );

  if (!entries.length) {
    return null;
  }

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-sm text-zinc-100">Downloads</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-wrap gap-2">
          {entries.map(([key, value]) => (
            <Button key={key} asChild variant="outline" size="sm">
              <a href={`${API_BASE_URL}/static-file?path=${encodeURIComponent(value)}`} target="_blank" rel="noreferrer">
                {labelByFormat[key] ?? `Download ${key.toUpperCase()}`}
              </a>
            </Button>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
