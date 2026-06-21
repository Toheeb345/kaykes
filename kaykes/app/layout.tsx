import type { Metadata } from "next";
import { Geist, Geist_Mono, Inter } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import { GoogleOAuthProvider } from "@react-oauth/google";
import Provider from "./provider";
import Header from "./_components/Header";

const inter = Inter({subsets:['latin'],variable:'--font-sans'});

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Kaykes",
  description: "demo created by me",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) { 
  return (
    <html
      lang="en"
      className={cn("h-full", "antialiased", geistSans.variable, geistMono.variable, "font-sans", inter.variable)}
    >
      <GoogleOAuthProvider clientId={process.env.GOOGLE_CLIENT_ID!}>
      <body className="min-h-full flex flex-col px-10 md:px-20 lg:px-25">
        <Provider>
                  {/* Header */}
        <Header />
          {children}
        </Provider>
      </body>
      </GoogleOAuthProvider>
    </html>
  );
}
