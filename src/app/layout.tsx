import { GeistSans } from "geist/font/sans";
import "./globals.css";
import TanstackProvider from "@/providers/TanstackProvider";
import Header from "@/components/header/Header";

const defaultUrl = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : "http://localhost:3000";

export const metadata = {
  metadataBase: new URL(defaultUrl),
  title: "Mindful breathing study",
  description: "Mindful breathing study",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={GeistSans.className}>
      <body className="bg-background text-foreground">
        <main className="min-h-screen flex flex-col items-center">
          <Header />
          <TanstackProvider>{children}</TanstackProvider>
        </main>
      </body>
    </html>
  );
}
