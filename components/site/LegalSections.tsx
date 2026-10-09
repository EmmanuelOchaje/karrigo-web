export type LegalSection = { id: string; title: string; body: string[] };

/** Numbered plain-language sections for the terms and privacy pages. */
export function LegalSections({ sections }: { sections: LegalSection[] }) {
  return (
    <div className="gap-xl mt-xxl flex flex-col">
      {sections.map((section, i) => (
        <section key={section.id} id={section.id} className="bg-bg rounded-panel-sm p-xl scroll-mt-xxl">
          <h2 className="text-site-title">
            {i + 1}. {section.title}
          </h2>
          <div className="text-site-answer text-text-secondary mt-md gap-md flex max-w-[62ch] flex-col text-pretty">
            {section.body.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}
