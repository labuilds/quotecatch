import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "QuoteCatch | The AI Pricing Engine for Roofers",
  description:
    "Stop driving 2 hours for tire-kickers. Add an AI-powered roofing estimator to your website in 60 seconds and capture pre-qualified leads.",
  openGraph: {
    title: "QuoteCatch | The AI Pricing Engine for Roofers",
    description:
      "Stop driving 2 hours for tire-kickers. Add an AI-powered roofing estimator to your website in 60 seconds and capture pre-qualified leads.",
    url: "https://getquotecatch.com",
    siteName: "QuoteCatch",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "QuoteCatch | The AI Pricing Engine for Roofers",
    description:
      "Stop driving 2 hours for tire-kickers. Add an AI-powered roofing estimator to your website in 60 seconds and capture pre-qualified leads.",
  },
  metadataBase: new URL("https://getquotecatch.com"),
};


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
