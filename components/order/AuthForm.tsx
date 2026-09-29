"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
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

export function AuthForm({ mode, next }: { mode: "login" | "signup"; next?: string }) {
  const router = useRouter();
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const destination = safeNext(next);
  const query = next ? `?next=${encodeURIComponent(destination)}` : "";
  const signup = mode === "signup";

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
        className="p-xxl md:p-gap-wide gap-xxl relative flex min-h-[360px] flex-col justify-between overflow-hidden"
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
        <div className="rounded-step bg-surface relative aspect-[16/10] overflow-hidden">
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
          <Link href={`/login${query}`} aria-current={!signup ? "page" : undefined} className="text-site-button relative flex-1 py-md text-center">
            Log in
          </Link>
          <Link href={`/signup${query}`} aria-current={signup ? "page" : undefined} className="text-site-button relative flex-1 py-md text-center">
            Sign up
          </Link>
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
          <Link href={`/${signup ? "login" : "signup"}${query}`} className="text-accent-text font-bold">
            {signup ? "Have an account? Log in" : "New here? Create an account"}
          </Link>
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
