import "@/app/styles/globals.css";
import type { Metadata } from "next";
import { Poppins, Raleway, Nunito, Quicksand } from "next/font/google";
import Header from "@/components/layout/Header";
import { Toaster } from 'react-hot-toast'
import Footer from "@/components/layout/Footer";

const poppins = Poppins({ subsets: ["latin"], weight: "700", variable: "--font-logo" });
const raleway = Raleway({ subsets: ["latin"], variable: "--font-heading" });
const nunito = Nunito({ subsets: ["latin"], variable: "--font-body" });
const quicksand = Quicksand({ subsets: ["latin"], weight: "700", variable: "--font-cta" });

export const metadata: Metadata = {
  title: "Tinivo – Small Things. Big Joy.",
  description: "Curated Korean-style mini products that spark joy.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${poppins.variable} ${raleway.variable} ${nunito.variable} ${quicksand.variable}`}>
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Nunito&family=Poppins:wght@700&family=Quicksand:wght@700&family=Raleway&display=swap"
          rel="stylesheet"
        />
        <link rel="icon" href="/assets/favicon.ico" sizes="any" />
      </head>
      <body className="font-body bg-white bg-gradient-to-br from-white to-white/80 text-neutral-dark">
        <Header />
        <main className="min-h-[70vh]">{children}</main>
         <Toaster position="top-right" reverseOrder={false} />
        <Footer />
      </body>
    </html>
  );
}
