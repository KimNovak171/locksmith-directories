import type { Metadata } from "next";
import Link from "next/link";
import { getDirectoryIndex } from "@/lib/stateFacilities";

export const metadata: Metadata = {
  title: "Full State and City Directory",
  description:
    "Browse every U.S. state and city included in LocksmithsDirectories.com.",
  alternates: { canonical: "/directory" },
};

export default async function DirectoryPage() {
  const directory = await getDirectoryIndex();

  return (
    <div className="mx-auto flex max-w-6xl flex-col gap-8 px-4 py-10 sm:px-6 lg:px-8">
      <header className="space-y-3">
        <h1 className="text-3xl font-semibold text-foreground">
          Full State and City Directory
        </h1>
        <p className="max-w-3xl text-sm text-foreground/75">
          Browse every location covered by LocksmithsDirectories.com. Choose a state,
          then select a city to view its locksmith listings.
        </p>
      </header>

      <section className="space-y-6" aria-labelledby="us-directory-heading">
        <h2 id="us-directory-heading" className="text-2xl font-semibold text-foreground">
          United States
        </h2>
        {directory.map((state) => (
          <div key={state.stateSlug} className="space-y-2 border-b border-teal/10 pb-5">
            <Link href={`/${state.stateSlug}`} className="text-lg font-semibold text-teal hover:text-teal-soft">
              {state.stateName}
            </Link>
            <div className="flex flex-wrap gap-x-3 gap-y-1">
              {state.cities.map((city) => (
                <Link key={`${state.stateSlug}-${city.citySlug}`} href={`/${state.stateSlug}/${city.citySlug}`} className="text-xs text-foreground/85 hover:text-teal">
                  {city.cityName}
                </Link>
              ))}
            </div>
          </div>
        ))}
      </section>
    </div>
  );
}
