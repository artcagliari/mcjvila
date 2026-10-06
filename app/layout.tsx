import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://mc-jvila-oficial.free-panda-5794.chatgpt.site"),
  title: "MC JVILA | Site Oficial",
  description: "Site oficial de MC JVILA. Música, lançamentos, agenda de shows, vídeos e novidades.",
  alternates: { canonical: "/" },
  keywords: ["MC JVILA", "funk paulista", "funk brasileiro", "música", "shows"],
  openGraph: {
    type: "website",
    locale: "pt_BR",
    url: "/",
    siteName: "MC JVILA",
    title: "MC JVILA | Site Oficial",
    description: "Música, lançamentos, agenda de shows, vídeos e novidades de MC JVILA.",
  },
  twitter: {
    card: "summary",
    title: "MC JVILA | Site Oficial",
    description: "Música, lançamentos, agenda de shows, vídeos e novidades de MC JVILA.",
  },
  manifest: "/manifest.webmanifest",
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body>
        {children}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "MusicGroup",
              name: "MC JVILA",
              url: "https://mc-jvila-oficial.free-panda-5794.chatgpt.site",
              sameAs: ["https://www.instagram.com/mc.jvila/"],
              genre: "Funk brasileiro",
            }).replace(/</g, "\\u003c"),
          }}
        />
      </body>
    </html>
  );
}
