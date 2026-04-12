import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "IDPI Playground",
  description: "Playground educativo para inyecciones de prompt indirectas",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className="dark">
      <body className={`${inter.className} bg-neutral-950 text-neutral-100 antialiased min-h-screen flex flex-col`}>
        <main className="flex-1">
          {children}
        </main>
      </body>
    </html>
  );
}
