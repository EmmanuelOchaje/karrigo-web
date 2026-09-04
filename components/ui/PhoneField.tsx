"use client";

import { useState } from "react";
import { TextField } from "./TextField";

/** Nigerian mobile numbers are 10 digits after +234. People type the leading 0. */
export function toNationalDigits(input: string): string {
  return input
    .replace(/\D/g, "")
    .replace(/^234/, "")
    .replace(/^0/, "")
    .slice(0, 10);
}

/** 8012345678 -> "801 234 5678" */
export function formatNational(digits: string): string {
  return [digits.slice(0, 3), digits.slice(3, 6), digits.slice(6, 10)]
    .filter(Boolean)
    .join(" ");
}

export function PhoneField({
  name = "phone",
  label,
  error,
  hint,
  defaultValue = "",
  onDigitsChange,
}: {
  name?: string;
  label?: string;
  error?: string;
  hint?: string;
  defaultValue?: string;
  onDigitsChange?: (digits: string) => void;
}) {
  const [digits, setDigits] = useState(() => toNationalDigits(defaultValue));

  return (
    <>
      <input type="hidden" name={name} value={digits && `+234${digits}`} />
      <TextField
        id={name}
        label={label}
        hint={hint}
        error={error}
        prefix="🇳🇬 +234"
        type="tel"
        inputMode="numeric"
        autoComplete="tel-national"
        placeholder="801 234 5678"
        value={formatNational(digits)}
        onChange={(e) => {
          const next = toNationalDigits(e.target.value);
          setDigits(next);
          onDigitsChange?.(next);
        }}
      />
    </>
  );
}
