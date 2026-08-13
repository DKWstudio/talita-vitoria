import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://talita-vitoria.vercel.app"),
  title: {
    default: "Talita Vitória | Bordados Vitória em Chapecó",
    template: "%s | Talita Vitória",
  },
  description: "Vitrine de enxovais Bordados Vitória com atendimento em Chapecó e Região.",
  keywords: ["enxovais", "bordados", "cama mesa e banho", "Chapecó", "Bordados Vitória"],
  openGraph: {
    type: "website",
    locale: "pt_BR",
    siteName: "Talita Vitória",
    title: "Talita Vitória | Bordados Vitória em Chapecó",
    description: "Enxovais, bordados e detalhes escolhidos com carinho para Chapecó e Região.",
    images: [{ url: "/brand/talita-vitoria-floral.jpeg", alt: "Talita Vitória" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Talita Vitória | Bordados Vitória em Chapecó",
    description: "Enxovais, bordados e detalhes escolhidos com carinho para Chapecó e Região.",
    images: ["/brand/talita-vitoria-floral.jpeg"],
  },
  icons: {
    icon: "/brand/talita-vitoria-icon.png",
    apple: "/brand/talita-vitoria-icon.png",
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="pt-BR" suppressHydrationWarning className="scroll-smooth"><body suppressHydrationWarning>{children}</body></html>;
}
