import Link from "next/link";

export function Topbar() {
  return (
    <header className="sticky top-0 z-40 border-b border-zinc-800/70 bg-zinc-950/90 backdrop-blur-xl">
      <div className="mx-auto flex h-16 w-full max-w-7xl items-center justify-between px-4 md:px-6">
        <Link href="/" className="flex items-center gap-3">
          <span className="grid h-8 w-8 place-items-center rounded-lg border border-zinc-700 bg-zinc-900 text-[11px] font-semibold tracking-wide text-zinc-100">
            DSP
          </span>
          <div>
            <p className="text-sm font-semibold tracking-tight text-zinc-100">Dynamic Subtitle Processor</p>
            <p className="text-xs text-zinc-500">Subtitle Operations Platform</p>
          </div>
        </Link>

        <div className="flex items-center gap-2">
          <span className="h-2 w-2 rounded-full bg-emerald-400" />
          <p className="rounded-full border border-zinc-800 bg-zinc-900 px-3 py-1 text-xs font-medium text-zinc-300">
            System Ready
          </p>
        </div>
      </div>
    </header>
  );
}
