import { redirect } from "next/navigation";

import { SignInForm } from "@/components/admin/SignInForm";
import { getAdmin } from "@/lib/admin/session";

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  if (await getAdmin()) redirect("/");
  const { signedOut } = await searchParams;

  return (
    <div className="relative grid min-h-screen place-items-center overflow-hidden px-lg py-xxl">
      {/* The brand's two circles, cropped by the viewport — the same furniture
          as the marketing hero, so ops does not feel like a different product. */}
      <span
        aria-hidden
        className="pointer-events-none absolute -top-[220px] -left-[160px] size-[560px] rounded-full border-[1.5px] border-accent/18"
      />
      <span
        aria-hidden
        className="pointer-events-none absolute -right-[180px] -bottom-[240px] size-[520px] rounded-full border-[1.5px] border-accent-warm/22"
      />
      <SignInForm signedOut={signedOut !== undefined} />
    </div>
  );
}
