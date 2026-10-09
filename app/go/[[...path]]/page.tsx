import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ButtonLink } from "@/components/ui/Button";
import { Logo } from "@/components/site/Logo";
import { appName, resolveLink, storeUrls } from "@/lib/app-links";

// An emailed link is for one person; keep it out of search results.
export const metadata: Metadata = {
  title: "Open in the Karrigo app",
  robots: { index: false, follow: false },
};

/**
 * What someone sees when they tap an emailed link and the app is not
 * installed (or they are on a computer). If the app is installed the phone
 * opens it straight to the right screen and never gets here.
 */
export default async function AppLinkPage({ params }: PageProps<"/go/[[...path]]">) {
  const { path } = await params;
  const target = resolveLink(path ?? []);
  if (!target) notFound();

  const name = appName(target.app);
  const stores = storeUrls(target.app);
  const hasStore = Boolean(stores.ios || stores.android);

  return (
    <main className="px-screen-x py-section-sm bg-bg flex grow flex-col items-center">
      <div className="gap-xxl flex w-full max-w-md flex-col">
        <Logo />

        <div className="gap-sm flex flex-col">
          <h1 className="text-display text-text">{target.title}</h1>
          <p className="text-site-body text-text-secondary">{target.body}</p>
        </div>

        <section className="bg-surface-raised rounded-card p-xl gap-lg flex flex-col" aria-labelledby="get-app">
          <h2 id="get-app" className="text-h2 text-text">
            {hasStore ? `Get ${name}` : `${name} is coming soon`}
          </h2>
          {hasStore ? (
            <div className="gap-sm flex flex-wrap">
              {stores.ios ? (
                <ButtonLink href={stores.ios} variant="dark" size="site">
                  App Store
                </ButtonLink>
              ) : null}
              {stores.android ? (
                <ButtonLink href={stores.android} variant="accent" size="site">
                  Google Play
                </ButtonLink>
              ) : null}
            </div>
          ) : (
            <p className="text-site-answer text-text-secondary">
              The app isn&apos;t in the stores yet. Already have it? Open this email on the
              phone where it&apos;s installed.
            </p>
          )}
        </section>

        {target.web ? (
          <ButtonLink href={target.web.href} variant="outline" size="site" full>
            {target.web.label}
          </ButtonLink>
        ) : null}
      </div>
    </main>
  );
}
