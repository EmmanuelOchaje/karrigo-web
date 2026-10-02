"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";

import { applyKitchen, kitchenLogIn } from "@/app/(order)/partners/actions";
import { AREAS } from "@/lib/order/schema";
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
    <form
      noValidate
      className="bg-bg rounded-panel-sm p-xl md:p-xxl gap-md mx-auto flex max-w-[520px] flex-col"
      onSubmit={(e) => {
        e.preventDefault();
        if (!email.trim() || !password) return setError("Enter your email and password.");
        startTransition(async () => {
          const result = await kitchenLogIn(email, password);
          if (!result.ok) return setError(result.error);
          router.push("/partners/kitchen");
          router.refresh();
        });
      }}
    >
      <h1 className="text-h1 font-extrabold">Log in to your kitchen</h1>
      <label className={fieldLabel}>
        Email
        <input type="email" value={email} onChange={(e) => { setEmail(e.target.value); setError(""); }} autoComplete="email" className={field} />
      </label>
      <label className={fieldLabel}>
        Password
        <input type="password" value={password} onChange={(e) => { setPassword(e.target.value); setError(""); }} autoComplete="current-password" className={field} />
      </label>
      <FormError>{error}</FormError>
      <SubmitButton busy={busy} idle="Log in" working="One moment…" />
      <p className="text-site-label text-text-secondary">
        New here?{" "}
        <Link href="/partners/kitchen" className="text-accent-text font-bold">
          Apply to cook with Karrigo
        </Link>
      </p>
    </form>
  );
}
