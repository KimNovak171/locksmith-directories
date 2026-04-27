import type { Metadata } from "next";
import { DIRECTORY_BRAND_NAME } from "@/lib/careTypesProse";
import { getDirectoryIndex } from "@/lib/stateFacilities";

type RegionPageProps = {
  params: Promise<{
    region: string;
  }>;
};

export async function generateMetadata({
  params,
}: RegionPageProps): Promise<Metadata> {
  const { region } = await params;
  const regionCode = region.toUpperCase();

  return {
    title: `Locksmiths in ${regionCode}`,
    description: `Explore locksmith options in ${regionCode} with ${DIRECTORY_BRAND_NAME}.`,
    openGraph: {
      title: `Locksmiths in ${regionCode} | ${DIRECTORY_BRAND_NAME}`,
      description: `Browse locksmiths and lock and key services in ${regionCode}.`,
      url: `/locations/${region}`,
      type: "website",
    },
  };
}

export async function generateStaticParams() {
  const directory = await getDirectoryIndex();
  return directory
    .filter((state) => state.stateSlug)
    .map((state) => ({ region: state.stateSlug! }));
}

export default async function RegionPage({ params }: RegionPageProps) {
  const { region } = await params;
  const regionCode = region.toUpperCase();

  return (
    <main className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="space-y-4">
        <p className="text-sm font-medium uppercase tracking-[0.2em] text-teal">
          Directory by region
        </p>
        <h1 className="text-3xl font-semibold text-navy">
          Locksmiths in {regionCode}
        </h1>
        <p className="max-w-2xl text-sm text-slate-600">
          This is a placeholder view for{" "}
          <span className="font-semibold">{regionCode}</span>. Here you&apos;ll
          be able to browse locksmiths and locksmith services in this state.
        </p>
        <div className="mt-6 rounded-xl border border-surface-muted bg-surface px-4 py-6 text-sm text-slate-500">
          Listing data will be loaded from your data model. This template
          ships with an empty{" "}
          <code className="rounded bg-surface-muted px-1 py-0.5 text-xs">
            /data
          </code>{" "}
          directory.
        </div>
      </div>
    </main>
  );
}
