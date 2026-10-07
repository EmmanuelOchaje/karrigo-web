"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";

import { applyKitchen, kitchenLogIn } from "@/app/(order)/partners/actions";
import { AREAS } from "@/lib/order/schema";
import { Screen } from "@/components/ui/Screen";
import { cn } from "@/lib/cn";
import { FormError, SubmitButton, field, fieldLabel } from "./parts";

/**
 * The first screen of a kitchen's application: who you are and what your
 * kitchen is called. Everything slower — location, bank, photo, menu — comes
 * after, on a page they can leave and come back to.
 */
export function KitchenApply() {
  const router = useRouter();
  const [form, setForm] = useState({
    kitchenName: "",
    cuisine: "",
    area: "",
    name: "",
    phone: "",
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [busy, startTransition] = useTransition();

  const set = (key: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm((f) => ({ ...f, [key]: e.target.value }));
    setError("");
  };

  function submit(e: React.FormEvent) {
    e.preventDefault();
    if (form.kitchenName.trim().length < 2) return setError("What is your kitchen called?");
    if (form.name.trim().length < 2) return setError("Add your own name.");
    if (!/^\S+@\S+\.\S+$/.test(form.email.trim())) return setError("Add an email — it's how you'll log in.");
    if (form.password.length < 8) return setError("Password needs at least 8 characters.");

    startTransition(async () => {
      const result = await applyKitchen(form);
      if (!result.ok) return setError(result.error);
      router.refresh();
    });
  }

  return (
    <form onSubmit={submit} noValidate className="bg-bg rounded-panel-sm p-xl md:p-xxl gap-md flex flex-col">
      <h2 className="text-h1 font-extrabold">Your kitchen</h2>
      <label className={fieldLabel}>
        Kitchen name
        <input value={form.kitchenName} onChange={set("kitchenName")} placeholder="Terkimbi's Kitchen" className={field} />
      </label>
      <div className="gap-md grid sm:grid-cols-2">
        <label className={fieldLabel}>
          What you cook
          <input value={form.cuisine} onChange={set("cuisine")} placeholder="Swallow & soups" className={field} />
        </label>
        <label className={fieldLabel}>
          Area
          <select value={form.area} onChange={set("area")} className={cn(field, "appearance-none")}>
            <option value="">Pick your area</option>
            {AREAS.map((a) => (
              <option key={a} value={a}>
                {a}
              </option>
            ))}
            <option value="Somewhere else in Makurdi">Somewhere else in Makurdi</option>
          </select>
        </label>
      </div>

      <h2 className="text-h1 mt-md font-extrabold">You</h2>
      <div className="gap-md grid sm:grid-cols-2">
        <label className={fieldLabel}>
          Your name
          <input value={form.name} onChange={set("name")} placeholder="Terkimbi Aondoakaa" autoComplete="name" className={field} />
        </label>
        <label className={fieldLabel}>
          Phone number
          <input value={form.phone} onChange={set("phone")} placeholder="0803 123 4567" inputMode="tel" autoComplete="tel" className={field} />
        </label>
      </div>
      <label className={fieldLabel}>
        Email
        <input type="email" value={form.email} onChange={set("email")} placeholder="you@example.com" autoComplete="email" className={field} />
      </label>
      <label className={fieldLabel}>
        Password
        <input type="password" value={form.password} onChange={set("password")} placeholder="At least 8 characters" autoComplete="new-password" className={field} />
      </label>

      <FormError>{error}</FormError>
      <SubmitButton busy={busy} idle="Start my application" working="Setting up your kitchen…" />
      <p className="text-site-label text-text-secondary">
        Already applied?{" "}
        <Link href="/partners/kitchen/login" className="text-accent-text font-bold">
          Log in to your kitchen
        </Link>
      </p>
    </form>
  );
}

export function KitchenLogin() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [busy, startTransition] = useTransition();

  return (
    <div className="bg-bg rounded-panel-lg mx-auto grid max-w-[1000px] overflow-hidden md:grid-cols-2">
      <Screen
        mode="dark"
        className="p-xxl md:p-gap-wide gap-xxl relative flex flex-col justify-between overflow-hidden md:min-h-[420px]"
      >
        <div
          aria-hidden
          className="border-accent/20 pointer-events-none absolute top-[-150px] right-[-130px] size-[320px] rounded-full border-[1.5px]"
        />
        <div className="relative">
          <h1 className="text-panel-small md:text-panel text-cream text-balance">
            Open up.
            <br />
            <span className="text-accent-text">We&rsquo;re hungry for you.</span>
          </h1>
          <p className="text-panel-body text-cream/66 mt-lg max-w-[30ch]">
            Take orders, change today&rsquo;s prices and mark a dish sold out — all from your phone.
          </p>
        </div>
        <div className="rounded-step bg-surface relative hidden aspect-[16/10] overflow-hidden md:block">
          <Image
            src="/food/terkimbis-kitchen.jpg"
            alt="A kitchen plating up an order"
            fill
            sizes="(max-width: 768px) 100vw, 440px"
            className="object-cover"
          />
        </div>
      </Screen>

      <form
        noValidate
        className="p-xxl md:p-gap-wide gap-md flex flex-col justify-center"
        onSubmit={(e) => {
          e.preventDefault();
          if (!email.trim() || !password) return setError("Enter your email and password.");
          startTransition(async () => {
            const result = await kitchenLogIn(email, password);
            if (!result.ok) return setError(result.error);
            // A live kitchen lands on its console; one still applying is sent
            // on from there to its application.
            router.push("/my-kitchen");
            router.refresh();
          });
        }}
      >
        <div className="mb-xs">
          <h2 className="text-h1 font-extrabold">Log in to your kitchen</h2>
          <p className="text-site-label text-text-secondary mt-xs">
            Use the email and password you set up your kitchen with.
          </p>
        </div>
        <label className={fieldLabel}>
          Email
          <input
            type="email"
            value={email}
            onChange={(e) => { setEmail(e.target.value); setError(""); }}
            autoComplete="email"
            placeholder="you@yourkitchen.com"
            className={field}
          />
        </label>
        <label className={fieldLabel}>
          Password
          <input
            type="password"
            value={password}
            onChange={(e) => { setPassword(e.target.value); setError(""); }}
            autoComplete="current-password"
            className={field}
          />
        </label>
        <FormError>{error}</FormError>
        <SubmitButton busy={busy} idle="Log in" working="One moment…" />
        <p className="text-site-label text-text-secondary border-surface-raised mt-sm border-t pt-lg">
          New here?{" "}
          <Link href="/partners/kitchen" className="text-accent-text font-bold">
            Apply to cook with Karrigo
          </Link>
        </p>
        <p className="text-site-label text-text-secondary">
          Riding instead?{" "}
          <Link href="/partners/rider" className="text-accent-text font-bold">
            Deliver with Karrigo
          </Link>
        </p>
      </form>
    </div>
  );
}
