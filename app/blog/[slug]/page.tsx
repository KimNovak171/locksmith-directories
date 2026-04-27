import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getPostBySlug, getPostSlugs } from "@/lib/blog";
import { DIRECTORY_BRAND_NAME } from "@/lib/careTypesProse";

const siteUrl = "https://locksmithdirectories.com";

type BlogPostPageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateStaticParams() {
  return getPostSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: BlogPostPageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPostBySlug(slug);

  if (!post) {
    return { title: "Article not found" };
  }

  const canonicalPath = `/blog/${post.slug}`;
  const canonicalUrl = `${siteUrl}${canonicalPath}`;

  return {
    title: post.title,
    description: post.description,
    alternates: {
      canonical: canonicalPath,
      languages: {
        "en-us": canonicalUrl,
      },
    },
    openGraph: {
      title: post.title,
      description: post.description,
      url: canonicalPath,
      siteName: DIRECTORY_BRAND_NAME,
      type: "article",
      publishedTime: post.date,
    },
  };
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);

  if (!post) {
    notFound();
  }

  const displayDate = (() => {
    const t = new Date(post.date).getTime();
    if (Number.isNaN(t)) {
      return post.date;
    }
    return new Date(post.date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  })();

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
      <nav className="text-sm text-slate-600">
        <Link href="/blog" className="font-medium text-teal hover:text-teal-soft">
          Blog
        </Link>
        <span className="mx-2 text-slate-400" aria-hidden>
          /
        </span>
        <span className="text-slate-500">Article</span>
      </nav>

      <article className="mt-6 max-w-3xl">
        <header className="space-y-3 border-b border-slate-200 pb-8">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-teal">
            Blog
          </p>
          <h1 className="text-3xl font-semibold text-navy sm:text-4xl">
            {post.title}
          </h1>
          <time
            dateTime={post.date}
            className="block text-sm font-medium text-slate-500"
          >
            {displayDate}
          </time>
          <p className="text-sm text-slate-600">{post.description}</p>
        </header>

        <div
          className="blog-markdown mt-10 max-w-none text-sm text-slate-700 [&_a]:text-teal [&_a]:underline [&_a]:hover:text-teal-soft [&_blockquote]:border-l-4 [&_blockquote]:border-slate-200 [&_blockquote]:pl-4 [&_blockquote]:italic [&_code]:rounded [&_code]:bg-slate-100 [&_code]:px-1 [&_code]:py-0.5 [&_code]:text-[0.9em] [&_h2]:mt-10 [&_h2]:mb-3 [&_h2]:text-xl [&_h2]:font-semibold [&_h2]:text-navy [&_h3]:mt-8 [&_h3]:mb-2 [&_h3]:text-lg [&_h3]:font-semibold [&_h3]:text-navy [&_li]:mb-1 [&_ol]:mb-4 [&_ol]:list-decimal [&_ol]:pl-5 [&_ol]:space-y-1 [&_p]:mb-4 [&_p]:leading-relaxed [&_pre]:mb-4 [&_pre]:overflow-x-auto [&_pre]:rounded-lg [&_pre]:bg-slate-900 [&_pre]:p-4 [&_pre]:text-xs [&_pre]:text-slate-100 [&_strong]:font-semibold [&_ul]:mb-4 [&_ul]:list-disc [&_ul]:pl-5 [&_ul]:space-y-1"
          dangerouslySetInnerHTML={{ __html: post.contentHtml }}
        />
      </article>

      <p className="mt-12 text-sm text-slate-600">
        <Link href="/blog" className="font-medium text-teal hover:text-teal-soft">
          All articles
        </Link>
      </p>
    </div>
  );
}
