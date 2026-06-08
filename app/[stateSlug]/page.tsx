import type { Metadata } from "next";
import Link from "next/link";
import { FacilityCard } from "@/components/FacilityCard";
import {
  getDirectoryIndex,
  getHreflangForRegionSlug,
  getStateSummary,
} from "@/lib/stateFacilities";
import {
  DEFAULT_LOCKSMITH_CARE_TYPES_SENTENCE,
  DIRECTORY_BRAND_NAME,
  formatCareTypesClause,
  locksmithCategorySchemaThings,
} from "@/lib/careTypesProse";

const siteUrl = "https://locksmithsdirectories.com";

type StatePageProps = {
  params: Promise<{ stateSlug: string }>;
};

export async function generateMetadata({
  params,
}: StatePageProps): Promise<Metadata> {
  const { stateSlug } = await params;
  const safeSlug = stateSlug ?? "";
  const locale = getHreflangForRegionSlug(safeSlug);
  const canonicalPath = `/${safeSlug.toLowerCase()}`;
  const canonicalUrl = `${siteUrl}${canonicalPath}`;

  const { stateName, totalFacilities, cities } = await getStateSummary(safeSlug);

  const title = `Locksmiths in ${stateName} | ${totalFacilities.toLocaleString()} Verified Listings | ${DIRECTORY_BRAND_NAME}`;

  const descriptor = `Browse ${totalFacilities.toLocaleString()} verified locksmith listings across ${cities.length.toLocaleString()} ${stateName} cities. Find residential, commercial, and automotive locksmiths — all rated 3 stars or higher on Google Maps.`;

  return {
    title,
    description: descriptor,
    alternates: {
      canonical: canonicalPath,
      languages: {
        [locale]: canonicalUrl,
      },
    },
    openGraph: {
      title,
      description: descriptor,
      url: canonicalPath,
      siteName: DIRECTORY_BRAND_NAME,
      type: "website",
      images: [
        {
          url: "/og-image.svg",
          width: 1200,
          height: 630,
          alt: `${stateName} locksmith directory preview`,
        },
      ],
    },
  };
}

export async function generateStaticParams() {
  const directory = await getDirectoryIndex();
  return directory.map((state) => ({ stateSlug: state.stateSlug }));
}

export default async function StatePage({ params }: StatePageProps) {
  const { stateSlug } = await params;
  const {
    stateName,
    stateSlug: resolvedStateSlug,
    totalFacilities,
    cities,
    facilities,
    averageRating,
    careTypes,
  } = await getStateSummary(stateSlug ?? "");
  const locksmithServiceFocusText =
    "locksmith services, emergency lockouts, rekeying, key cutting, automotive keys, and commercial hardware";
  const majorCities = [...cities]
    .sort((a, b) => b.facilityCount - a.facilityCount)
    .slice(0, 6)
    .map((city) => city.cityName);
  const majorCitiesText = majorCities.slice(0, 4).join(", ");

  const hasRating = typeof averageRating === "number";
  const careTypesSentence =
    careTypes.length > 0
      ? formatCareTypesClause(careTypes, 6).replace(/^including /i, "")
      : DEFAULT_LOCKSMITH_CARE_TYPES_SENTENCE;

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
        name: stateName,
        item: `${siteUrl}/${resolvedStateSlug}`,
      },
    ],
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: `How many locksmiths are listed in ${stateName}?`,
        acceptedAnswer: {
          "@type": "Answer",
          text: `Our directory lists ${totalFacilities.toLocaleString()} verified facilities across ${cities.length.toLocaleString()} cities.`,
        },
      },
      {
        "@type": "Question",
        name: `What types of locksmith services appear in ${stateName}?`,
        acceptedAnswer: {
          "@type": "Answer",
          text: `${careTypesSentence}.`,
        },
      },
      {
        "@type": "Question",
        name: "How are listings selected for this directory?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Listings are sourced from Google Maps, verified, and must have a minimum 3-star rating.",
        },
      },
    ],
  };

  const webpageSchema = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: `Locksmiths in ${stateName}`,
    url: `${siteUrl}/${resolvedStateSlug}`,
    isPartOf: {
      "@type": "WebSite",
      name: DIRECTORY_BRAND_NAME,
      url: `${siteUrl}/`,
    },
    about: [
      {
        "@type": "Thing",
        name: `${stateName} locksmiths`,
      },
      ...locksmithCategorySchemaThings(),
    ],
    speakable: {
      "@type": "SpeakableSpecification",
      cssSelector: ["h1", "main p"],
    },
  };

  return (
    <main className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(webpageSchema) }}
      />
      <nav className="mb-4" aria-label="Breadcrumb">
        <Link
          href="/"
          className="text-sm font-medium text-teal hover:text-teal-soft hover:underline"
        >
          ← Back to homepage
        </Link>
      </nav>
      <Link
        href="/advertise"
        className="mb-4 flex items-center justify-center gap-2 rounded-full bg-teal px-5 py-3 text-center text-sm font-semibold text-white shadow-md transition hover:bg-teal-soft focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal focus-visible:ring-offset-2"
        aria-label="View featured listing pricing and benefits"
      >
        Get your listing featured — view pricing &amp; benefits →
      </Link>
      <section className="rounded-2xl bg-surface-muted px-5 py-6 text-foreground shadow-lg shadow-navy/10 ring-1 ring-gold/40 sm:px-8 sm:py-8">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-gold-soft">
          State overview
        </p>
        <h1 className="mt-2 text-3xl font-semibold sm:text-4xl">
          Locksmiths in {stateName}
        </h1>
        <p className="mt-3 max-w-2xl text-sm text-foreground/80">
          Explore {locksmithServiceFocusText} across {stateName}, including major city
          areas such as {majorCitiesText}. Use this page to find listings by city and
          compare contact details, ratings, and services.
        </p>

        <div className="mt-5 grid gap-4 text-sm sm:grid-cols-3">
          <div className="rounded-xl bg-surface p-4 ring-1 ring-navy/10">
            <p className="text-xs font-semibold uppercase tracking-wide text-gold-soft">
              Listings
            </p>
            <p className="mt-1 text-2xl font-semibold">
              {totalFacilities.toLocaleString()}
            </p>
          </div>
          <div className="rounded-xl bg-surface p-4 ring-1 ring-navy/10">
            <p className="text-xs font-semibold uppercase tracking-wide text-gold-soft">
              Cities covered
            </p>
            <p className="mt-1 text-2xl font-semibold">{cities.length}</p>
          </div>
          <div className="rounded-xl bg-surface p-4 ring-1 ring-navy/10">
            <p className="text-xs font-semibold uppercase tracking-wide text-gold-soft">
              Average rating
            </p>
            <p className="mt-1 flex items-baseline gap-2 text-2xl font-semibold">
              {hasRating ? averageRating?.toFixed(1) : "—"}
              {hasRating && (
                <span className="text-xs font-medium text-gold-soft">
                  / 5 stars
                </span>
              )}
            </p>
          </div>
        </div>
      </section>

      <section className="mt-8 rounded-2xl border-2 border-navy/20 bg-background p-6 space-y-4">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 className="text-sm font-semibold uppercase tracking-[0.18em] text-navy border-b-2 border-teal/50 pb-1 inline-block">
              Listings by city in {stateName}
            </h2>
            <p className="mt-1 max-w-2xl text-sm text-slate-600">
              Choose a city to browse locksmiths and locksmith services in {stateName},
              including lockouts, rekeying, key replacement, and access control support.
            </p>
          </div>
          <div className="text-xs text-slate-500">
            <Link href="/" className="text-teal hover:text-teal-soft">
              Back to homepage
            </Link>
          </div>
        </div>

        {cities.length === 0 ? (
          <p className="text-sm text-slate-600">
            We don&apos;t have listings for {stateName} yet. As new data becomes
            available, cities and listings will appear here.
          </p>
        ) : (
          <div className="mt-4 grid gap-3 sm:grid-cols-2 md:grid-cols-3">
            {cities.map((city) => (
              <Link
                key={city.citySlug}
                href={`/${resolvedStateSlug}/${city.citySlug}`}
                className="group flex items-center justify-between rounded-lg border border-surface-muted border-l-[3px] border-l-navy bg-surface px-3 py-2 text-sm text-navy shadow-sm transition hover:border-teal hover:bg-surface-muted hover:text-navy"
              >
                <div className="flex flex-col">
                  <span className="font-medium">{city.cityName}</span>
                  <span className="text-xs text-slate-600 group-hover:text-navy/85">
                    {city.facilityCount.toLocaleString()}{" "}
                    {city.facilityCount === 1 ? "listing" : "listings"}
                  </span>
                </div>
                {city.averageRating ? (
                  <span className="rounded-full bg-teal px-2.5 py-1 text-xs font-bold text-white">
                    {city.averageRating.toFixed(1)}★
                  </span>
                ) : (
                  <span className="rounded-full bg-teal px-2.5 py-1 text-xs font-bold text-white">
                    N/A
                  </span>
                )}
              </Link>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
