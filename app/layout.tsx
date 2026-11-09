import type { Metadata, Viewport } from "next";
import { EB_Garamond, IM_Fell_English } from "next/font/google";
import { LangProvider } from "@/lib/i18n";
import "./design.css";
import "./globals.css";

const fell = IM_Fell_English({ weight: "400", style: ["normal", "italic"], subsets: ["latin"], variable: "--font-fell-raw" });
const garamond = EB_Garamond({ weight: ["400", "500"], style: ["normal", "italic"], subsets: ["latin"], variable: "--font-garamond-raw" });

export const metadata: Metadata = {
  title: "Twist My Story — Un roman à quatre mains",
  description: "Chacun votre tour, vous écrivez la suite de l’histoire. Deux plumes, une histoire, sans retour en arrière.",
  openGraph: {
    title: "Twist My Story",
    description: "Un roman à quatre mains. Chacun votre tour, vous écrivez la suite de l’histoire.",
    type: "website",
    locale: "fr_FR",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#fbf9f4",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr" className={`${fell.variable} ${garamond.variable}`}>
      <body>
        <LangProvider>{children}</LangProvider>
      </body>
    </html>
  );
}
