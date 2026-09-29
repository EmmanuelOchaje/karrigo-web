"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useState } from "react";
import { Screen } from "@/components/ui/Screen";
import { Button } from "@/components/ui/Button";
import { firstIssue, loginSchema, signupSchema } from "@/lib/order/schema";
import { logIn, say, signUp } from "@/lib/order/store";
import { cn } from "@/lib/cn";

const field =
  "border-border-strong focus:border-text rounded-field text-site-body bg-bg border-[1.5px] px-lg py-md font-medium outline-none transition-colors duration-(--duration-fast)";
const fieldLabel = "text-label flex flex-col gap-sm font-bold";

/** Only same-site paths — never bounce a fresh login to another origin. */
function safeNext(next?: string) {
  return next && next.startsWith("/") && !next.startsWith("//") ? next : "/kitchens";
}

type Mode = "login" | "signup";

/**
 * `?next=` is read in the browser so /login and /signup stay static pages.
 * Until the query is readable (the prerendered HTML) the form renders without
 * it — the only difference is the checkout banner and where success goes.
 */
export function AuthForm({ mode }: { mode: Mode }) {
  return (
    <Suspense fallback={<AuthCard mode={mode} />}>
      <AuthFormWithQuery mode={mode} />
    </Suspense>
  );
}

function AuthFormWithQuery({ mode }: { mode: Mode }) {
  const next = useSearchParams().get("next") ?? undefined;
  return <AuthCard mode={mode} next={next} />;
}

function AuthCard({ mode: initialMode, next }: { mode: Mode; next?: string }) {
  const router = useRouter();
  const [mode, setModeState] = useState<Mode>(initialMode);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const destination = safeNext(next);
  const query = next ? `?next=${encodeURIComponent(destination)}` : "";
  const signup = mode === "signup";

  // Switching tabs is a state change, not a navigation: the form stays
  // mounted, so the pill slides and typed values survive. The URL follows
  // along in place so a refresh or a shared link still opens the right tab.
  function setMode(nextMode: Mode) {
    setModeState(nextMode);
    setError("");
    window.history.replaceState(null, "", `/${nextMode}${query}`);
  }

  function submit(e: React.FormEvent) {
    e.preventDefault();
    let failed: string | null;
    if (signup) {
      const parsed = signupSchema.safeParse({ name, phone, password });
      if (!parsed.success) return setError(firstIssue(parsed.error));
      failed = signUp(parsed.data.name, parsed.data.phone);
    } else {
      const parsed = loginSchema.safeParse({ phone, password });
      if (!parsed.success) return setError(firstIssue(parsed.error));
      failed = logIn(parsed.data.phone);
    }
    if (failed) return setError(failed);
    router.push(destination);
  }

  return (
    <div className="bg-bg rounded-panel-lg mx-auto grid max-w-[1000px] overflow-hidden md:grid-cols-2">
      <Screen
        mode="dark"
        className="p-xxl md:p-gap-wide gap-xxl relative flex md:min-h-[360px] flex-col justify-between overflow-hidden"
      >
        <div
          aria-hidden
          className="border-accent/20 pointer-events-none absolute right-[-120px] bottom-[-160px] size-[420px] rounded-full border-[1.5px]"
        />
        <div className="relative">
          <h1 className="text-panel-small md:text-panel text-cream text-balance">
            Hungry?
            <br />
            <span className="text-accent-text">Let&rsquo;s get you fed.</span>
          </h1>
          <p className="text-panel-body text-cream/66 mt-lg max-w-[30ch]">
            One account for ordering, saved landmarks and live rider tracking.
          </p>
        </div>
        <div className="rounded-step bg-surface relative hidden aspect-[16/10] overflow-hidden md:block">
          <Image src="/food/jollof.jpg" alt="A plate of jollof rice" fill sizes="(max-width: 768px) 100vw, 440px" className="object-cover" />
        </div>
      </Screen>

      <div className="p-xxl md:p-gap-wide">
        <div className="bg-surface-raised rounded-pill relative flex p-xs">
          <span
            aria-hidden
            className={cn(
              "bg-bg rounded-pill absolute top-xs bottom-xs left-xs w-[calc(50%-4px)] shadow-[0_6px_14px_-8px_rgba(14,15,13,0.35)] transition-transform duration-(--duration-slow)",
              signup && "translate-x-full",
            )}
          />
          <button type="button" onClick={() => setMode("login")} aria-pressed={!signup} className="text-site-button relative flex-1 py-md text-center">
            Log in
          </button>
          <button type="button" onClick={() => setMode("signup")} aria-pressed={signup} className="text-site-button relative flex-1 py-md text-center">
            Sign up
          </button>
        </div>

        {next === "/checkout" && (
          <p className="bg-accent/15 text-accent-text rounded-chip text-site-label mt-lg px-lg py-md font-semibold">
            Log in or sign up to place your order. Your cart is saved.
          </p>
        )}

        <form onSubmit={submit} noValidate className="gap-md mt-xl flex flex-col">
          {signup && (
            <label className={cn(fieldLabel, "rise")}>
              Full name
              <input value={name} onChange={(e) => { setName(e.target.value); setError(""); }} placeholder="Doosuur Terhemba" autoComplete="name" className={field} />
            </label>
          )}
          <label className={fieldLabel}>
            Phone number
            <input value={phone} onChange={(e) => { setPhone(e.target.value); setError(""); }} placeholder="0803 123 4567" inputMode="tel" autoComplete="tel" className={field} />
          </label>
          <label className={fieldLabel}>
            Password
            <input type="password" value={password} onChange={(e) => { setPassword(e.target.value); setError(""); }} placeholder="At least 6 characters" autoComplete={signup ? "new-password" : "current-password"} className={field} />
          </label>
          {error && (
            <p role="alert" className="text-danger-text text-site-label shake font-semibold">
              {error}
            </p>
          )}
          <Button type="submit" variant="dark" size="site" full className="mt-xs">
            {signup ? "Create account" : "Log in"}
          </Button>
        </form>

        <div className="text-site-label mt-lg gap-sm flex flex-wrap justify-between font-semibold">
          <button type="button" onClick={() => setMode(signup ? "login" : "signup")} className="text-accent-text font-bold">
            {signup ? "Have an account? Log in" : "New here? Create an account"}
          </button>
          {!signup && (
            <button
              type="button"
              className="text-text-secondary"
              onClick={() => say(phone ? `Reset code sent to ${phone}` : "Enter your phone number first")}
            >
              Forgot password?
            </button>
          )}
        </div>

        <Link href="/kitchens" className="text-text-secondary text-site-label mt-xxl inline-block font-semibold">
          Browse kitchens first →
        </Link>
      </div>
    </div>
  );
}
