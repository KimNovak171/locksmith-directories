import type { Metadata } from "next";
import Link from "next/link";
import { getAllPosts } from "@/lib/blog";
import { DIRECTORY_BRAND_NAME } from "@/lib/careTypesProse";

export const metadata: Metadata = {
  title: "Blog",
  description:
    `Guides and articles on choosing a locksmith, understanding lock and key services, and home and business security from ${DIRECTORY_BRAND_NAME}.`,
  alternates: {
    canonical: "/blog",
  },
  openGraph: {
    title: `Blog | ${DIRECTORY_BRAND_NAME}`,
    url: "/blog",
    siteName: DIRECTORY_BRAND_NAME,
    type: "website",
  },
};

function formatPostDate(isoDate: string): string {
  const t = new Date(isoDate).getTime();
  if (Number.isNaN(t)) {
    return isoDate;
  }
  return new Date(isoDate).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export default function BlogIndexPage() {
  const posts = getAllPosts();

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
      <header className="space-y-3">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-teal">
          Blog
        </p>
        <h1 className="text-3xl font-semibold text-navy sm:text-4xl">
          Articles &amp; guides
        </h1>
        <p className="max-w-3xl text-sm text-slate-600">
          Practical tips on finding qualified locksmiths, comparing quotes, and
          planning lock and key work—written for homeowners and businesses.
        </p>
      </header>

      <ul className="mt-10 divide-y divide-slate-200 border-y border-slate-200">
        {posts.map((post) => (
          <li key={post.slug} className="py-6">
            <article className="flex flex-col gap-2 sm:flex-row sm:items-baseline sm:justify-between sm:gap-8">
              <div className="min-w-0 flex-1 space-y-2">
                <Link
                  href={`/blog/${post.slug}`}
                  className="text-lg font-semibold text-navy transition-colors hover:text-teal"
                >
                  {post.title}
                </Link>
                <p className="text-sm text-slate-600">{post.description}</p>
              </div>
              <time
                dateTime={post.date}
                className="shrink-0 text-xs font-medium uppercase tracking-wide text-slate-500"
              >
                {formatPostDate(post.date)}
              </time>
            </article>
          </li>
        ))}
      </ul>

      <p className="mt-10 text-sm text-slate-600">
        <Link href="/" className="font-medium text-teal hover:text-teal-soft">
          Back to homepage
        </Link>
      </p>
    </div>
  );
}
