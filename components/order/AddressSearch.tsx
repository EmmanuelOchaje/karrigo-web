"use client";

import { useEffect, useRef, useState } from "react";

import { searchAddresses, type AddressSuggestion } from "@/app/(order)/actions";
import { cn } from "@/lib/cn";

/**
 * The street address field, with places suggested as you type. Picking one is
 * optional: free text plus the landmark is always enough (CLAUDE.md — never
 * require a pin). Searching needs a signed-in customer, so it stays a plain
 * field until there is one.
 */
export function AddressSearch({
  value,
  onChange,
  onPick,
  searchable,
  className,
}: {
  value: string;
  onChange: (text: string) => void;
  onPick: (place: AddressSuggestion) => void;
  searchable: boolean;
  className: string;
}) {
  const [results, setResults] = useState<AddressSuggestion[]>([]);
  const [open, setOpen] = useState(false);
  const [problem, setProblem] = useState("");
  /** Set when the text came from a pick, so it isn't searched again. */
  const picked = useRef<string | null>(null);
  const ticket = useRef(0);

  useEffect(() => {
    const q = value.trim();
    if (!searchable || q.length < 3 || picked.current === value) {
      setResults([]);
      return;
    }
    const mine = ++ticket.current;
    const wait = setTimeout(async () => {
      const result = await searchAddresses(q);
      if (mine !== ticket.current) return;
      if (!result.ok) {
        setProblem(result.error);
        setResults([]);
        return;
      }
      setProblem("");
      setResults(result.results);
      setOpen(true);
    }, 400);
    return () => clearTimeout(wait);
  }, [value, searchable]);

  return (
    <div className="relative">
      <input
        value={value}
        onChange={(e) => {
          picked.current = null;
          onChange(e.target.value);
        }}
        onFocus={() => results.length && setOpen(true)}
        onBlur={() => setTimeout(() => setOpen(false), 150)}
        placeholder="12 Old Otukpo Road"
        autoComplete="street-address"
        role="combobox"
        aria-expanded={open && results.length > 0}
        aria-controls="address-suggestions"
        aria-autocomplete="list"
        className={cn(className, "w-full")}
      />
      {open && results.length > 0 && (
        <ul
          id="address-suggestions"
          role="listbox"
          className="bg-bg border-border-strong rounded-field absolute inset-x-0 top-full z-20 mt-xs overflow-hidden border-[1.5px]"
        >
          {results.map((r) => (
            <li key={`${r.label}-${r.lat}-${r.lng}`} role="option" aria-selected={false}>
              <button
                type="button"
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => {
                  picked.current = r.label;
                  setOpen(false);
                  onPick(r);
                }}
                className="text-site-label hover:bg-surface-raised w-full px-lg py-md text-left font-semibold"
              >
                {r.label}
              </button>
            </li>
          ))}
        </ul>
      )}
      {problem && <p className="text-site-chip text-text-secondary mt-xs font-medium">{problem}</p>}
    </div>
  );
}
