import "./globals.css";
import { Geist } from "next/font/google";
import { cn } from "@/lib/utils";
import { Footer1 } from "@/components/ui/footer"

const geist = Geist({subsets:['latin'],variable:'--font-sans'});


export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={cn("font-sans", geist.variable)}>
      <body className="antialiased bg-slate-50">
        <main>{children}</main>
        <Footer1/>
        </body>
    </html>
  );
}