import type { Metadata } from "next";
import { fetchSeoSettings } from "@/lib/seo-content-api";
import { buildSiteMetadata } from "@/lib/seo-metadata";
import { Poppins } from "next/font/google";
import { HeaderSwitcher } from "@/components/layout/HeaderSwitcher";
import "./globals.css";
import { FooterSwitcher } from "@/components/layout/FooterSwitcher";
import { DisclaimerModal } from "@/components/common/DisclaimerModal";
import { SiteLayoutProvider } from "@/components/layout/SiteLayoutProvider";

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

export async function generateMetadata(): Promise<Metadata> {
  const settings = await fetchSeoSettings();
  return buildSiteMetadata(settings);
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${poppins.variable} h-full antialiased`}>
      <body className="flex min-h-full flex-col bg-white font-sans text-[#263238]">
        <SiteLayoutProvider>
          <HeaderSwitcher />
          <DisclaimerModal />
          <div className="flex flex-1 flex-col">{children}</div>
          <FooterSwitcher />
        </SiteLayoutProvider>
      </body>
    </html>
  );
}
