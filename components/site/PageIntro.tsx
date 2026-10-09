import { Eyebrow } from "@/components/site/Eyebrow";

/** The top of an inner page: label, big heading, one plain line under it. */
export function PageIntro({
  eyebrow,
  title,
  children,
}: {
  eyebrow: string;
  title: string;
  children?: React.ReactNode;
}) {
  return (
    <header>
      <Eyebrow className="rise">{eyebrow}</Eyebrow>
      <h1 className="text-section-small md:text-section rise rise-1 mt-md text-balance">{title}</h1>
      {children && (
        <p className="text-site-body text-text-secondary rise rise-2 mt-lg max-w-[56ch] text-pretty">{children}</p>
      )}
    </header>
  );
}

/** Every inner page sits in the same column and rhythm. */
export function PageBody({ children, width = "1100px" }: { children: React.ReactNode; width?: "760px" | "1100px" }) {
  return (
    <main
      className={`px-screen-x mx-auto w-full pt-section-sm pb-section-sm md:pt-section ${
        width === "760px" ? "max-w-[760px]" : "max-w-[1100px]"
      }`}
    >
      {children}
    </main>
  );
}
