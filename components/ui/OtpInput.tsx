"use client";

import { useRef, useState } from "react";
import { cn } from "@/lib/cn";

export function OtpInput({
  length = 6,
  name = "code",
  error,
  onComplete,
}: {
  length?: number;
  name?: string;
  error?: boolean;
  onComplete?: (code: string) => void;
}) {
  const [digits, setDigits] = useState<string[]>(() => Array(length).fill(""));
  const inputs = useRef<(HTMLInputElement | null)[]>([]);

  const commit = (next: string[]) => {
    setDigits(next);
    const code = next.join("");
    if (code.length === length) onComplete?.(code);
  };

  const focus = (index: number) => inputs.current[index]?.focus();

  const handleInput = (index: number, raw: string) => {
    const typed = raw.replace(/\D/g, "");
    if (!typed) return;

    // A paste, an autofilled SMS code, or a single keystroke all land here.
    const next = [...digits];
    for (let i = 0; i < typed.length && index + i < length; i++) {
      next[index + i] = typed[i];
    }
    commit(next);
    focus(Math.min(index + typed.length, length - 1));
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace") {
      e.preventDefault();
      const next = [...digits];
      if (next[index]) {
        next[index] = "";
      } else if (index > 0) {
        next[index - 1] = "";
        focus(index - 1);
      }
      commit(next);
    }
    if (e.key === "ArrowLeft" && index > 0) focus(index - 1);
    if (e.key === "ArrowRight" && index < length - 1) focus(index + 1);
  };

  return (
    <div className="flex gap-sm" role="group" aria-label={`${length}-digit code`}>
      <input type="hidden" name={name} value={digits.join("")} />
      {digits.map((digit, index) => (
        <input
          key={index}
          ref={(el) => {
            inputs.current[index] = el;
          }}
          aria-label={`Digit ${index + 1}`}
          inputMode="numeric"
          autoComplete={index === 0 ? "one-time-code" : "off"}
          value={digit}
          onChange={(e) => handleInput(index, e.target.value)}
          onKeyDown={(e) => handleKeyDown(index, e)}
          onFocus={(e) => e.target.select()}
          className={cn(
            "rounded-otp aspect-[1/1.14] min-w-0 flex-1 text-center",
            "text-h1 outline-none",
            digit ? "bg-accent text-on-accent" : "bg-surface text-text",
            "focus:border-[1.5px] focus:border-accent-text",
            error && "border-[1.5px] border-danger",
          )}
        />
      ))}
    </div>
  );
}
