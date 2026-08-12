import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Talita Vitória | Bordados Vitória em Chapecó",
  description: "Vitrine de enxovais Bordados Vitória com atendimento em Chapecó e Região.",
  icons: {
    icon: "/brand/talita-vitoria-icon.png",
    apple: "/brand/talita-vitoria-icon.png",
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="pt-br" suppressHydrationWarning className="scroll-smooth"><body suppressHydrationWarning>{children}</body></html>;
}
