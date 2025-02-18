import "./globals.css";
import type { Metadata } from "next";
import NextTopLoader from "nextjs-toploader";
import { Toaster } from "@/components/ui/sonner";
import { primaryText } from "./fonts/font";
import TanstackQueryClientProvider from "@/providers/TanstackQueryClientProvider";

export const metadata: Metadata = {
  title: {
    default: "Dashboard | Lala's Car",
    template: "%s",
  },
  description: "Lala's Car",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-behavior-smooth">
      <body className={`${primaryText.className} antialiased`}>
        <TanstackQueryClientProvider>
          <NextTopLoader
            color="#b0312a"
            showSpinner={false}
            speed={200}
            easing="ease"
          />
          <Toaster position="bottom-right" richColors/>
          {children}
        </TanstackQueryClientProvider>
      </body>
    </html>
  );
}
