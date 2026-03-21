import "./globals.css";
import type { ReactNode } from "react";
import { Sidebar } from "../components/layout/sidebar";
import { Topbar } from "../components/layout/topbar";

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className="antialiased">
        <Topbar />
        <div className="mx-auto flex min-h-[calc(100vh-4rem)] w-full max-w-7xl gap-6 px-4 py-6 md:px-6">
          <Sidebar />
          <main className="min-w-0 flex-1">{children}</main>
        </div>
      </body>
    </html>
  );
}
