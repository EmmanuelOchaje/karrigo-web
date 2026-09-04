import { ButtonLink } from "@/components/ui/Button";

export default function HomePage() {
  return (
    <main className="px-screen-x py-xxl mx-auto flex max-w-[520px] flex-1 flex-col justify-center">
      <p className="text-h2 font-light">
        M<span className="font-semibold">-Kart</span>~
      </p>

      <h1 className="text-display mt-xl">
        Makurdi eats.
        <br />
        <span className="text-accent-text">We deliver.</span>
      </h1>

      <p className="text-body text-text-secondary mt-md">
        The marketing site, ordering flow and restaurant dashboard are being built.
        The component library is up.
      </p>

      <ButtonLink href="/kitchen-sink" variant="accent" className="mt-xl self-start">
        View the kitchen sink
      </ButtonLink>
    </main>
  );
}
