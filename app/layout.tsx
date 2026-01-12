import type { Metadata } from "next";
import { Geist, Geist_Mono, Playfair_Display } from "next/font/google";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://dcabundance.org"),
  title: {
    default: "DC Abundance",
    template: "%s | DC Abundance",
  },
  description: "Build a more abundant DC—more housing, better transportation, clean energy, and efficient government for everyone.",
  keywords: ["DC", "Washington DC", "abundance", "housing", "transportation", "energy", "government", "policy"],
  authors: [{ name: "DC Abundance" }],
  openGraph: {
    title: "DC Abundance",
    description: "Build a more abundant DC—more housing, better transportation, clean energy, and efficient government for everyone.",
    url: "https://dcabundance.org",
    siteName: "DC Abundance",
    locale: "en_US",
    type: "website",
    images: [
      {
        url: "/images/union-station.jpg",
        width: 1200,
        height: 630,
        alt: "DC Abundance - Building a more abundant Washington, DC",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "DC Abundance",
    description: "Build a more abundant DC—more housing, better transportation, clean energy, and efficient government for everyone.",
    images: ["/images/union-station.jpg"],
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${playfair.variable} antialiased`}
      >
        <Header />
        <main className="min-h-screen pt-16 lg:pt-20">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
