import type { Metadata } from "next";
import Link from "next/link";
import { Geist, Geist_Mono } from "next/font/google";
import { getDirectoryIndex } from "@/lib/stateFacilities";
import { DIRECTORY_BRAND_NAME } from "@/lib/careTypesProse";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://locksmithsdirectories.com"),
  title: {
    default: `${DIRECTORY_BRAND_NAME} | Locksmith Directory`,
    template: `%s | ${DIRECTORY_BRAND_NAME}`,
  },
  description:
    `${DIRECTORY_BRAND_NAME} is a professional directory helping people and businesses find local locksmiths, lock and key services, and mobile and shop-based help across the United States.`,
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: `${DIRECTORY_BRAND_NAME} | Locksmith Directory`,
    description:
      "Trusted resource to explore and compare locksmiths, lock and key services, and emergency and scheduled work across the United States.",
    url: "/",
    siteName: DIRECTORY_BRAND_NAME,
    type: "website",
    images: [
      {
        url: "/og-image.svg",
        width: 1200,
        height: 630,
        alt: `${DIRECTORY_BRAND_NAME} preview`,
      },
    ],
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const directory = await getDirectoryIndex();

  return (
    <html lang="en">
      <head>
        {/* Google tag (gtag.js) */}
        <script
          async
          src="https://www.googletagmanager.com/gtag/js?id=G-PV1XP2ZK98"
        />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag("js", new Date());
              gtag("config", "G-PV1XP2ZK98");
            `,
          }}
        />
        <script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-8586688641645596"
          crossOrigin="anonymous"
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <div className="flex min-h-screen flex-col bg-background text-foreground">
          <header className="w-full bg-navy text-white border-b-[3px] border-gold">
            <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
              <div className="flex items-center gap-6">
                <Link
                  href="/"
                  className="text-[11px] font-bold tracking-[0.28em] sm:text-xs text-white transition-colors hover:text-gold-soft"
                  aria-label={`${DIRECTORY_BRAND_NAME} – go to homepage`}
                >
                  {DIRECTORY_BRAND_NAME}
                </Link>
                <nav className="flex items-center gap-4" aria-label="Main navigation">
                  <Link
                    href="/"
                    className="text-xs font-medium text-white/90 transition-colors hover:text-gold-soft"
                  >
                    USA
                  </Link>
                  <Link
                    href="/blog"
                    className="text-xs font-medium text-white/90 transition-colors hover:text-gold-soft"
                  >
                    Blog
                  </Link>
                  <Link
                    href="/contact"
                    className="text-xs font-medium text-white/90 transition-colors hover:text-gold-soft"
                  >
                    Contact
                  </Link>
                  <Link
                    href="/advertise"
                    className="inline-flex items-center rounded-full bg-[#059669] px-4 py-2 text-xs font-semibold text-white shadow-sm transition hover:bg-[#047857] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2 focus-visible:ring-offset-navy"
                  >
                    Advertise
                  </Link>
                </nav>
              </div>
              <p className="ml-4 hidden max-w-xs text-right text-xs text-white/85 sm:block">
                Trusted locksmith directory for finding licensed, local locksmith services.
              </p>
            </div>
          </header>

          <main className="flex-1">{children}</main>

          <section
            className="w-full bg-navy border-t-[3px] border-gold px-4 py-5 text-white/80 sm:px-6 lg:px-8"
            aria-label="Full state and city directory"
          >
            <div className="mx-auto flex max-w-6xl flex-col gap-4">
              <h2 className="text-sm font-semibold text-white">
                Full State and City Directory
              </h2>
              <p className="text-[11px] text-white/70">
                Crawlable internal links to every state and city page.
              </p>
              <div className="flex flex-col gap-5">
                {directory.map((state) => (
                  <div key={state.stateSlug} className="space-y-2">
                    <Link
                      href={`/${state.stateSlug}`}
                      className="text-sm font-semibold text-gold-soft hover:text-gold"
                    >
                      {state.stateName}
                    </Link>
                    <div className="flex flex-wrap gap-x-3 gap-y-1">
                      {state.cities.map((city) => (
                        <Link
                          key={`${state.stateSlug}-${city.citySlug}`}
                          href={`/${state.stateSlug}/${city.citySlug}`}
                          className="text-[11px] text-white/85 hover:text-gold"
                        >
                          {city.cityName}
                        </Link>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          <footer className="w-full bg-navy border-t-[3px] border-gold">
            <div className="mx-auto flex max-w-6xl flex-col gap-4 px-4 py-5 text-xs text-white/80 sm:px-6 lg:px-8">
              <p>
                © {new Date().getFullYear()} {DIRECTORY_BRAND_NAME}. For
                informational purposes only – always verify licensing and credentials
                with the appropriate authority in your area.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link href="/about" className="hover:text-gold">
                  About this directory
                </Link>
                <Link href="/contact" className="hover:text-gold">
                  Contact
                </Link>
                <Link href="/privacy" className="hover:text-gold">
                  Privacy &amp; terms
                </Link>
                <Link href="/advertise" className="hover:text-gold">
                  Advertise
                </Link>
                <Link href="/advertise" className="hover:text-gold">
                  For locksmiths
                </Link>
                <Link href="/advertise" className="hover:text-gold">
                  Featured listing
                </Link>
              </div>
            </div>
          </footer>
        </div>
      </body>
    </html>
  );
}
