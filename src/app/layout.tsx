// File: app/store/[storeUuid]/layout.tsx
import type { Metadata } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import { UserProvider } from "@/lib/context/UserContext"
import React from "react"
import "./globals.css"

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
})

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
})

export const metadata: Metadata = {
  title: "My App",
  description: "…",
}

type LayoutProps = {
  children: React.ReactNode
  params: { storeUuid: string }
}

export default function StoreLayout({ children, params }: LayoutProps) {
  // params.storeUuid comes from the URL segment [storeUuid]
  const { storeUuid } = params

  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
          <UserProvider>{children}</UserProvider>
      </body>
    </html>
  )
}
