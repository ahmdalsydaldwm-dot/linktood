import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { BioPreview } from "@/lib/bio";
import { getPublicPage } from "@/lib/public-page.functions";

export const Route = createFileRoute("/u/$username")({
  loader: async ({ params }) => {
    const page = await getPublicPage({ data: params.username });
    if (!page) throw notFound();
    return page;
  },
  head: ({ loaderData }) => {
    const name = loaderData?.profile.display_name || loaderData?.profile.username || "صفحة روابط";
    const desc = loaderData?.profile.bio || `كل روابط ${name} في صفحة واحدة عبر رابطي.`;
    return {
      meta: [
        { title: `${name} | رابطي` },
        { name: "description", content: desc.slice(0, 155) },
        { property: "og:title", content: `${name} | رابطي` },
        { property: "og:description", content: desc.slice(0, 155) },
        { property: "og:type", content: "profile" },
        { name: "twitter:card", content: "summary_large_image" },
      ],
    };
  },
  errorComponent: () => (
    <div dir="rtl" className="grid min-h-screen place-items-center px-4 text-center">
      <p className="text-sm text-muted-foreground">تعذّر تحميل هذه الصفحة، حاول لاحقاً.</p>
    </div>
  ),
  notFoundComponent: () => (
    <div dir="rtl" className="grid min-h-screen place-items-center gap-4 px-4 text-center">
      <div>
        <h1 className="text-2xl font-black">هذه الصفحة غير موجودة</h1>
        <p className="mt-2 text-sm text-muted-foreground">لم نعثر على مستخدم بهذا الرابط.</p>
        <Link
          to="/"
          className="mt-5 inline-block rounded-full bg-primary px-5 py-2.5 text-sm font-bold text-primary-foreground"
        >
          العودة للرئيسية
        </Link>
      </div>
    </div>
  ),
  component: PublicPage,
});

function PublicPage() {
  const { profile, links } = Route.useLoaderData();
  return (
    <div dir="rtl" className={`min-h-screen ${profile.theme}`}>
      <main className="mx-auto min-h-screen w-full max-w-lg">
        <BioPreview profile={profile} links={links} className="min-h-screen rounded-none sm:px-10" />
      </main>
    </div>
  );
}