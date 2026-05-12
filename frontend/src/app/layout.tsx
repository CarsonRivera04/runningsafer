import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "My Fullstack App",
  description: "FastAPI + Next.js Integration",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-slate-50 text-slate-900`}>
        <div className="flex flex-col min-h-screen">
          {/* Navigation Header */}
          <header className="sticky top-0 z-50 w-full border-b bg-white/80 backdrop-blur-md">
            <div className="container mx-auto flex h-16 items-center justify-between px-4">
              <div className="flex items-center gap-2 font-bold text-xl tracking-tight">
                <span className="bg-blue-600 text-white px-2 py-1 rounded">FS</span>
                <span>Project</span>
              </div>
              
              <nav className="hidden md:flex gap-6 text-sm font-medium">
                <a href="/" className="hover:text-blue-600 transition-colors">Home</a>
                <a href="/roles" className="hover:text-blue-600 transition-colors">Roles</a>
                <a href="/dashboard" className="hover:text-blue-600 transition-colors">Dashboard</a>
              </nav>

              <div className="flex items-center gap-4">
                <button className="bg-slate-900 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-slate-800 transition-colors">
                  Get Started
                </button>
              </div>
            </div>
          </header>

          {/* Main Content Area */}
          <main className="flex-1 container mx-auto px-4 py-8">
            {children}
          </main>

          {/* Footer */}
          <footer className="border-t bg-white">
            <div className="container mx-auto px-4 py-6 text-center text-sm text-slate-500">
              © {new Date().getFullYear()} My Fullstack Project. Built with FastAPI & Next.js.
            </div>
          </footer>
        </div>
      </body>
    </html>
  );
}