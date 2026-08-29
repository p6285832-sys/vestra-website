import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import SmoothScroll from "@/components/SmoothScroll";
import Grain from "@/components/Grain";
import Spotlight from "@/components/Spotlight";

const archivo = localFont({
  src: [
    {
      path: "../../node_modules/@fontsource/archivo/files/archivo-latin-500-normal.woff2",
      weight: "500",
    },
    {
      path: "../../node_modules/@fontsource/archivo/files/archivo-latin-600-normal.woff2",
      weight: "600",
    },
    {
      path: "../../node_modules/@fontsource/archivo/files/archivo-latin-700-normal.woff2",
      weight: "700",
    },
    {
      path: "../../node_modules/@fontsource/archivo/files/archivo-latin-800-normal.woff2",
      weight: "800",
    },
  ],
  variable: "--font-archivo",
  display: "swap",
  preload: true,
});

const inter = localFont({
  src: [
    {
      path: "../../node_modules/@fontsource/inter/files/inter-latin-400-normal.woff2",
      weight: "400",
    },
    {
      path: "../../node_modules/@fontsource/inter/files/inter-latin-500-normal.woff2",
      weight: "500",
    },
    {
      path: "../../node_modules/@fontsource/inter/files/inter-latin-600-normal.woff2",
      weight: "600",
    },
  ],
  variable: "--font-inter",
  display: "swap",
  preload: true,
});

const jbmono = localFont({
  src: [
    {
      path: "../../node_modules/@fontsource/jetbrains-mono/files/jetbrains-mono-latin-400-normal.woff2",
      weight: "400",
    },
    {
      path: "../../node_modules/@fontsource/jetbrains-mono/files/jetbrains-mono-latin-500-normal.woff2",
      weight: "500",
    },
  ],
  variable: "--font-jbmono",
  display: "swap",
  preload: true,
});

export const metadata: Metadata = {
  title: "Vestra Finance — Disciplined Strategy. Long-Term Wealth.",
  description:
    "Vestra Finance applies professional, risk-managed trading strategies to your capital — targeting 18–24% annual returns with consistent monthly payouts and total transparency.",
  metadataBase: new URL("https://vestrafinance.com"),
  openGraph: {
    title: "Vestra Finance — Disciplined Strategy. Long-Term Wealth.",
    description:
      "Professional, risk-managed capital growth for serious long-term wealth-builders.",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Vestra Finance — Disciplined Strategy. Long-Term Wealth.",
    description:
      "Professional, risk-managed capital growth for serious long-term wealth-builders.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${archivo.variable} ${inter.variable} ${jbmono.variable}`}
    >
      <body>
        <SmoothScroll>{children}</SmoothScroll>
        <Spotlight />
        <Grain />
      </body>
    </html>
  );
}
