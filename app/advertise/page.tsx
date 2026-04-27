import type { Metadata } from "next";
import Link from "next/link";
import {
  DIRECTORY_BRAND_NAME,
  DIRECTORY_SUPPORT_EMAIL,
} from "@/lib/careTypesProse";

export const metadata: Metadata = {
  title: "Advertise | Get Your Business in Front of Customers",
  description:
    `Featured and premium listings on ${DIRECTORY_BRAND_NAME}. Reach customers actively searching for locksmith services across the United States.`,
  alternates: {
    canonical: "/advertise",
    languages: {
      "en-us": "https://locksmithdirectories.com/advertise",
    },
  },
  openGraph: {
    title: "Advertise | Get Your Business in Front of Customers",
    description:
      "A featured listing puts your business at the top of your city directory section in front of visitors comparing locksmith services.",
    url: "/advertise",
    siteName: DIRECTORY_BRAND_NAME,
    type: "website",
    images: [
      {
        url: "/og-image.svg",
        width: 1200,
        height: 630,
        alt: `${DIRECTORY_BRAND_NAME} advertise preview`,
      },
    ],
  },
};

const siteUrl = "https://locksmithdirectories.com";
const STRIPE_LINK_FEATURED =
  "https://buy.stripe.com/eVqdR92vU5vx2BM2f7fAc0M";
const STRIPE_LINK_PREMIUM =
  "https://buy.stripe.com/eVq8wP9YmbTV3FQ6vnfAc0N";

export default function AdvertisePage() {
  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: DIRECTORY_BRAND_NAME,
        item: `${siteUrl}/`,
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Advertise",
        item: `${siteUrl}/advertise`,
      },
    ],
  };

  return (
    <main className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />

      <header className="space-y-3">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-teal">
          For locksmiths
        </p>
        <h1 className="text-3xl font-semibold text-navy sm:text-4xl">
          Get Your Listing in Front of Customers Who Need Locksmith Services
        </h1>
        <p className="max-w-3xl text-sm text-slate-600">
          {DIRECTORY_BRAND_NAME} is visited by people actively searching for locksmiths
          and lock and key help across the United States. A featured or premium listing
          highlights your business when prospects compare local options.
        </p>
      </header>

      <section className="mt-10 grid gap-6 md:grid-cols-2">
        <article className="rounded-xl border border-surface-muted bg-surface p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-navy">
            Featured Listing — $49/month
          </h2>
          <p className="mt-4 text-sm text-slate-600">
            Get your business featured at the top of your city directory page on{" "}
            {DIRECTORY_BRAND_NAME}. Your listing appears above standard listings with
            a Featured badge, giving you maximum visibility to customers actively
            searching for locksmith services in your area. Cancel anytime.
          </p>
          <ul className="mt-4 list-disc space-y-2 pl-5 text-sm text-slate-600">
            <li>Priority placement at the top of your city directory section</li>
            <li>Featured badge on your listing</li>
            <li>Included in the Top Picks section on your state page</li>
            <li>Cancel anytime</li>
          </ul>
          <a
            href={STRIPE_LINK_FEATURED}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-5 inline-flex w-full items-center justify-center rounded-full bg-teal px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-teal-soft focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal focus-visible:ring-offset-2"
          >
            Pay $49/month with Stripe
          </a>
        </article>
        <article className="rounded-xl border border-surface-muted bg-surface p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-navy">
            Premium Listing — $99/month
          </h2>
          <p className="mt-4 text-sm text-slate-600">
            Get everything included in the Featured listing, plus prominent placement
            in the Featured Locksmiths section on your state directory page, your
            business logo or photo displayed on your listing, and a custom tagline of
            up to 25 words. Cancel anytime.
          </p>
          <ul className="mt-4 list-disc space-y-2 pl-5 text-sm text-slate-600">
            <li>Everything in Featured</li>
            <li>Featured Locksmiths section on the state directory page</li>
            <li>Your business logo or photo displayed</li>
            <li>Custom tagline (up to 25 words)</li>
            <li>Cancel anytime</li>
          </ul>
          <a
            href={STRIPE_LINK_PREMIUM}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-5 inline-flex w-full items-center justify-center rounded-full bg-teal px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-teal-soft focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal focus-visible:ring-offset-2"
          >
            Pay $99/month with Stripe
          </a>
        </article>
      </section>

      <section className="mt-10 rounded-xl border border-gold/30 bg-gold/5 px-6 py-5">
        <p className="text-sm text-slate-700">
          To get started or ask questions, contact us at{" "}
          <a
            href={`mailto:${DIRECTORY_SUPPORT_EMAIL}`}
            className="font-medium text-teal underline underline-offset-2 hover:text-teal-soft"
          >
            {DIRECTORY_SUPPORT_EMAIL}
          </a>{" "}
          — we&apos;ll have your listing live within 24 hours.
        </p>
      </section>

      <div className="mt-8 text-sm text-slate-600">
        <Link href="/" className="text-teal hover:text-teal-soft">
          Back to homepage
        </Link>
      </div>
    </main>
  );
}
