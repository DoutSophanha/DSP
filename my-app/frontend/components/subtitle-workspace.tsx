import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";

type SubtitlePair = {
  start: string;
  end: string;
  original: string;
  translated: string;
};

type Props = {
  subtitlePairs: SubtitlePair[];
};

function Timestamp({ start, end }: { start: string; end: string }) {
  return <span className="text-xs text-zinc-500">{start} → {end}</span>;
}

export function SubtitleWorkspace({ subtitlePairs }: Props) {
  if (!subtitlePairs.length) {
    return (
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm text-zinc-100">Subtitle Workspace</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-zinc-400">No subtitle content available.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <section>
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-sm text-zinc-100">Subtitle Workspace</CardTitle>
            <p className="text-xs text-zinc-400">{subtitlePairs.length} segments</p>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="space-y-2 rounded-xl border border-zinc-800 bg-zinc-900/60 p-3">
              <h3 className="text-sm font-medium text-zinc-100">Original</h3>
              <div className="max-h-[28rem] space-y-3 overflow-y-auto pr-1">
                {subtitlePairs.map((pair, index) => (
                  <article key={`${pair.start}-${index}`} className="space-y-1">
                    <Timestamp start={pair.start} end={pair.end} />
                    <p className="text-sm leading-6 text-zinc-200">{pair.original}</p>
                  </article>
                ))}
              </div>
            </div>

            <div className="space-y-2 rounded-xl border border-zinc-800 bg-zinc-900/60 p-3">
              <h3 className="text-sm font-medium text-zinc-100">Translated</h3>
              <div className="max-h-[28rem] space-y-3 overflow-y-auto pr-1">
                {subtitlePairs.map((pair, index) => (
                  <article key={`${pair.end}-${index}`} className="space-y-1">
                    <Timestamp start={pair.start} end={pair.end} />
                    <p className="text-sm leading-6 text-zinc-200">{pair.translated}</p>
                  </article>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </section>
  );
}
