import type { Metadata } from "next";
import Link from "next/link";
import { FacilityCard } from "@/components/FacilityCard";
import { getDirectoryIndex, getStateSummary, getGlobalStats } from "@/lib/stateFacilities";
import {
  DIRECTORY_BRAND_NAME,
  DIRECTORY_SUPPORT_EMAIL,
} from "@/lib/careTypesProse";

export async function generateMetadata(): Promise<Metadata> {
  const stats = getGlobalStats();
  const total = stats.totalFacilities.toLocaleString();
  const title = `Locksmith Directory USA | ${total} verified listings`;
  const description = `Browse ${total} verified locksmiths and locksmith listings across the United States — all rated 3 stars or higher on Google Maps.`;

  return {
    title,
    description,
    alternates: {
      canonical: "/",
    },
    openGraph: {
      title,
      description,
      url: "/",
      siteName: DIRECTORY_BRAND_NAME,
      type: "website",
      images: [
        {
          url: "/og-image.svg",
          width: 1200,
          height: 630,
          alt: `${DIRECTORY_BRAND_NAME} home preview`,
        },
      ],
    },
  };
}

export default async function Home() {
  const usDirectory = await getDirectoryIndex();
  const usStatesSorted = [...usDirectory].sort((a, b) =>
    a.stateName.localeCompare(b.stateName, "en", { sensitivity: "base" }),
  );
  const stateSummaries = await Promise.all(
    usDirectory.map((s) => getStateSummary(s.stateSlug)),
  );
  const globalStats = getGlobalStats();

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: DIRECTORY_BRAND_NAME,
        item: "https://locksmithdirectories.com/",
      },
    ],
  };

  return (
    <div className="bg-surface-muted text-foreground">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <section className="w-full bg-surface">
        <div className="w-full bg-navy text-white">
          <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 sm:py-12 lg:px-8">
            <div className="space-y-6">
              <p className="inline-flex rounded-full border border-white/25 bg-white/10 px-3 py-1 text-xs font-medium uppercase tracking-[0.2em] text-white backdrop-blur-sm">
                Locksmith directories
              </p>
              <h1 className="text-balance text-3xl font-semibold leading-tight text-white sm:text-4xl lg:text-5xl">
                Find Trusted Locksmiths — US States
              </h1>
              <p className="max-w-2xl text-balance text-sm text-white/85 sm:text-base">
                Verified locksmiths and locksmith services—residential, commercial, and
                automotive—across the United States. Browse by state, then by city.
                Every listing rated 3★ or higher on Google Maps.
              </p>

              <section
                aria-label="Directory statistics"
                className="w-full border-t border-white/15 pt-8"
              >
                <div className="grid w-full gap-4 sm:grid-cols-2 lg:grid-cols-4">
                  <div className="rounded-xl bg-white p-4 text-center shadow-sm">
                    <p className="text-teal text-xs font-semibold uppercase tracking-wide">
                      Verified listings
                    </p>
                    <p className="mt-2 text-navy text-2xl font-bold">
                      {globalStats.totalFacilities.toLocaleString()}
                    </p>
                  </div>
                  <div className="rounded-xl bg-white p-4 text-center shadow-sm">
                    <p className="text-teal text-xs font-semibold uppercase tracking-wide">
                      Cities covered
                    </p>
                    <p className="mt-2 text-navy text-2xl font-bold">
                      {globalStats.totalCities.toLocaleString()}
                    </p>
                  </div>
                  <div className="rounded-xl bg-white p-4 text-center shadow-sm">
                    <p className="text-teal text-xs font-semibold uppercase tracking-wide">
                      Average rating
                    </p>
                    <p className="mt-2 text-navy text-2xl font-bold">
                      {globalStats.averageRating != null
                        ? `${globalStats.averageRating}★`
                        : "—"}
                    </p>
                  </div>
                  <div className="rounded-xl bg-white p-4 text-center shadow-sm">
                    <p className="text-teal text-xs font-semibold uppercase tracking-wide">
                      Quality standard
                    </p>
                    <p className="mt-2 text-navy text-2xl font-bold">3★ minimum</p>
                  </div>
                </div>
              </section>
            </div>
          </div>
        </div>

        <div className="mx-auto flex max-w-6xl flex-col gap-10 px-4 py-12 sm:px-6 lg:py-16 lg:px-8">
          <div className="w-full rounded-2xl border-2 border-teal/40 bg-surface p-6 shadow-xl shadow-navy/20 ring-1 ring-gold/30">
            <h2 className="text-xl font-semibold text-navy">
              Start with a state directory
            </h2>
            <p className="mt-2 text-sm text-navy/90">
              Browse verified locksmiths by state, then drill down by city to compare
              services and contact details.
            </p>

            <p className="mt-2 text-sm font-medium text-navy">
              {usStatesSorted.map((s) => s.stateName).join(" • ")}
            </p>
            <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {usStatesSorted.map((state) => (
                <Link
                  key={state.stateSlug}
                  href={`/${state.stateSlug}`}
                  className="rounded-xl border-2 border-gold bg-surface-muted px-5 py-4 text-left text-navy transition hover:border-teal/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                >
                  <p className="text-lg font-semibold">{state.stateName}</p>
                  <p className="mt-1 text-sm text-gold-soft">
                    {state.stateName} — {state.totalFacilities.toLocaleString()} listings
                  </p>
                </Link>
              ))}
            </div>

            <p className="mt-4 text-sm font-medium text-navy">
              Each state has its own dedicated directory — specific firms, specific
              cities, built for that state only.
            </p>
          </div>
        </div>
      </section>

      {(() => {
        const allFeatured = stateSummaries
          .flatMap((s) => s.facilities)
          .filter((f) => f.featured === true || f.premium === true)
          .slice(0, 6);
        if (allFeatured.length === 0) return null;
        return (
          <section className="mx-auto max-w-6xl rounded-2xl border-2 border-teal/20 bg-surface px-4 py-10 sm:px-6 lg:px-8">
            <h2 className="text-xl font-semibold text-navy">
              Featured listings
            </h2>
            <p className="mt-1 text-sm text-navy/75">
              Selected businesses across our directories — verified listings for
              customers comparing locksmiths and locksmith services.
            </p>
            <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {allFeatured.map((facility) => (
                <FacilityCard key={facility.id} facility={facility} />
              ))}
            </div>
          </section>
        );
      })()}

      <p className="mx-auto max-w-2xl rounded-lg border-2 border-gold/40 bg-surface px-4 py-3 text-center text-sm text-navy/90">
        Locksmiths: Get featured at the top of your city listing.{" "}
        <Link
          href="/advertise"
          className="font-medium text-teal underline underline-offset-2 hover:text-teal-soft"
        >
          Learn about featured placement
        </Link>{" "}
        or contact{" "}
        <a
          href={`mailto:${DIRECTORY_SUPPORT_EMAIL}`}
          className="font-medium text-teal underline underline-offset-2 hover:text-teal-soft"
        >
          {DIRECTORY_SUPPORT_EMAIL}
        </a>
        .
      </p>

      <section className="bg-surface">
        <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-semibold text-teal border-b-2 border-gold/50 pb-2 inline-block">
            How it works
          </h2>
          <div className="mt-6 grid gap-4 md:grid-cols-3">
            <div className="rounded-xl border-l-4 border-teal border border-surface-muted bg-surface-muted p-5 shadow-sm">
              <p className="text-2xl" aria-hidden="true">
                1️⃣
              </p>
              <h3 className="mt-3 text-lg font-semibold text-navy">
                Choose your state
              </h3>
              <p className="mt-2 text-sm text-navy/75">
                Pick your state to open a full directory of cities and locksmith
                listings.
              </p>
            </div>
            <div className="rounded-xl border-l-4 border-teal border border-surface-muted bg-surface-muted p-5 shadow-sm">
              <p className="text-2xl" aria-hidden="true">
                2️⃣
              </p>
              <h3 className="mt-3 text-lg font-semibold text-navy">
                Browse by city
              </h3>
              <p className="mt-2 text-sm text-navy/75">
                Compare local options by city with ratings, services offered, and
                contact details.
              </p>
            </div>
            <div className="rounded-xl border-l-4 border-teal border border-surface-muted bg-surface-muted p-5 shadow-sm">
              <p className="text-2xl" aria-hidden="true">
                3️⃣
              </p>
              <h3 className="mt-3 text-lg font-semibold text-navy">
                Contact locksmiths directly
              </h3>
              <p className="mt-2 text-sm text-navy/75">
                Use website and maps links to verify details and reach out to the
                locksmith or business you choose.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-surface-muted border-y border-navy/10">
        <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-semibold text-navy border-b-2 border-teal/50 pb-2 inline-block">
            Why trust us
          </h2>
          <div className="mt-6 grid gap-4 md:grid-cols-3">
            <article className="rounded-xl border-l-4 border-navy border border-surface-muted bg-surface p-5 shadow-sm">
              <h3 className="text-lg font-semibold text-teal">
                Google-verified data
              </h3>
              <p className="mt-2 text-sm text-navy/75">
                Listings sourced from Google Maps with real ratings and reviews.
              </p>
            </article>
            <article className="rounded-xl border-l-4 border-navy border border-surface-muted bg-surface p-5 shadow-sm">
              <h3 className="text-lg font-semibold text-teal">
                Quality filtered
              </h3>
              <p className="mt-2 text-sm text-navy/75">
                Minimum 3-star rating; unrelated businesses filtered where possible.
              </p>
            </article>
            <article className="rounded-xl border-l-4 border-navy border border-surface-muted bg-surface p-5 shadow-sm">
              <h3 className="text-lg font-semibold text-teal">
                Always free to browse
              </h3>
              <p className="mt-2 text-sm text-navy/75">
                No signup required—helpful information for anyone planning lock or key
                work or hiring a locksmith.
              </p>
            </article>
          </div>
        </div>
      </section>

      <section className="bg-surface">
        <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
          <div className="rounded-2xl border border-gold/50 bg-surface p-6 text-navy ring-1 ring-gold/30">
            <h2 className="text-2xl font-semibold text-navy">
              Are you a locksmith business?
            </h2>
            <p className="mt-3 max-w-3xl text-sm text-navy/90">
              Get your business seen by customers actively searching for locksmiths and
              lock and key services in your city. Featured listings available.
            </p>
            <div className="mt-5">
              <Link
                href="/advertise"
                className="inline-flex items-center justify-center rounded-full border border-navy/20 bg-navy px-5 py-2.5 text-sm font-semibold uppercase tracking-wide text-white shadow-sm transition hover:bg-navy-soft focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2 focus-visible:ring-offset-background"
              >
                Learn about featured listings
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
