import type { Metadata } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import { PremiumCursor } from "@/components/cursor"
import "./globals.css"

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
})

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
})

export const metadata: Metadata = {
  title: {
    default: "MCP Explorer — Discover & Test MCP Servers",
    template: "%s | MCP Explorer",
  },
  description:
    "The premium developer platform to discover, inspect, and test public MCP servers. Browse the official MCP Registry with a beautiful, modern interface.",
  keywords: ["MCP", "Model Context Protocol", "AI tools", "developer tools", "API explorer"],
  authors: [{ name: "MCP Explorer" }],
  openGraph: {
    title: "MCP Explorer",
    description: "Discover, inspect, and test public MCP servers",
    type: "website",
  },
}

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className="dark">
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        <PremiumCursor />
        {children}
      </body>
    </html>
  )
}
