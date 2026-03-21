import { Film, History, LayoutDashboard, Settings, Speech } from "lucide-react";

const items = [
  { label: "Dashboard", icon: LayoutDashboard, active: false },
  { label: "Subtitle Tool", icon: Film, active: true },
  { label: "TTS Generator", icon: Speech, active: false },
  { label: "History", icon: History, active: false },
  { label: "Settings", icon: Settings, active: false },
];

export function Sidebar() {
  return (
    <aside className="sticky top-20 hidden h-[calc(100vh-6rem)] w-64 shrink-0 md:block">
      <div className="h-full rounded-2xl border border-zinc-800/80 bg-zinc-950/60 p-3">
        <p className="px-3 pb-2 text-[11px] font-medium uppercase tracking-[0.16em] text-zinc-500">Workspace</p>
        <nav className="space-y-1">
          {items.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.label}
                type="button"
                className={[
                  "flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm transition",
                  item.active
                    ? "border border-zinc-700 bg-zinc-900 text-zinc-100"
                    : "border border-transparent text-zinc-400 hover:border-zinc-800 hover:bg-zinc-900/80 hover:text-zinc-200",
                ].join(" ")}
              >
                <Icon className="h-4 w-4 text-zinc-500" />
                <span className="font-medium">{item.label}</span>
              </button>
            );
          })}
        </nav>
      </div>
    </aside>
  );
}
