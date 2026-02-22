import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Sidebar } from "@/components/layout/sidebar";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export const metadata: Metadata = {
  title: "Daily Focus Tracker",
  description: "Track your daily tasks and stay productive",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} font-sans antialiased`}>
        <div className="flex h-screen overflow-hidden">
          <Sidebar />
          <main className="flex flex-1 flex-col overflow-auto">
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}
