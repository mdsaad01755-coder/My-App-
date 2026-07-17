import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Nimbus — Your SaaS Product Name",
  description:
    "A premium landing page starting point for a modern SaaS product.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full flex flex-col bg-base text-text">
        {children}
      </body>
    </html>
  );
}
