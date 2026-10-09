import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ButtonLink } from "@/components/ui/Button";
import { Screen } from "@/components/ui/Screen";
import { Eyebrow } from "@/components/site/Eyebrow";
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
 *
 * The column width is an arbitrary value on purpose: the site's spacing scale
 * defines `md` as 12px, which turns Tailwind's `max-w-md` into a 12px column.
 */
export default async function AppLinkPage({ params }: PageProps<"/go/[[...path]]">) {
  const { path } = await params;
  const target = resolveLink(path ?? []);
  if (!target) notFound();

  const name = appName(target.app);
  const stores = storeUrls(target.app);
  const hasStore = Boolean(stores.ios || stores.android);

  return (
    <Screen mode="dark" className="relative flex min-h-dvh grow flex-col overflow-hidden">
      {/* The brand's two circles, cropped by the viewport. */}
      <span
        aria-hidden
        className="border-accent/18 pointer-events-none absolute -top-[220px] -left-[160px] size-[560px] rounded-full border-[1.5px]"
      />
      <span
        aria-hidden
        className="border-accent-warm/22 pointer-events-none absolute -right-[180px] -bottom-[240px] size-[520px] rounded-full border-[1.5px]"
      />

      <header className="px-screen-x pt-xl relative">
        <Logo mode="dark" />
      </header>

      <main className="px-screen-x py-section-sm relative flex grow items-center justify-center">
        <div className="gap-xxl flex w-full max-w-[480px] flex-col">
          <div className="gap-md flex flex-col">
            <Eyebrow tone="onDark">{name}</Eyebrow>
            <h1 className="text-panel-small md:text-panel text-balance">{target.title}</h1>
            <p className="text-panel-body text-text-secondary">{target.body}</p>
          </div>

          <section className="bg-surface rounded-panel-sm p-xl gap-lg flex flex-col" aria-labelledby="get-app">
            <h2 id="get-app" className="text-h2">
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
                The app isn&apos;t in the stores yet. Already have it? Open this email on the phone where
                it&apos;s installed.
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
    </Screen>
  );
}
