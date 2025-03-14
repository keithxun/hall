import "~/styles/globals.css";

import { GeistSans } from "geist/font/sans";
import { type Metadata } from "next";

import { TRPCReactProvider } from "~/trpc/react";

import { ClerkProvider } from "@clerk/nextjs";
import Header from "./_components/header";

export const metadata: Metadata = {
  title: "RH App",
  description: "Developed by RH Dev",
  icons: [{ rel: "icon", url: "/RH_logo.svg" }],
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <ClerkProvider>
      <html lang="en" className={`${GeistSans.variable}`}>
        <body className="bg-gradient-to-b from-gray-800 to-blue-900 text-white">
          <TRPCReactProvider>
            <Header />
            {children}
          </TRPCReactProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
