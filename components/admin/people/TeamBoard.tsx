"use client";

import { useState, useTransition } from "react";

import { ConfirmAction } from "@/components/admin/ConfirmAction";
import { StatusChip } from "@/components/admin/ui";
import { say } from "@/lib/admin/store";
import { whenLabel } from "@/lib/admin/format";
import type { Schemas } from "@/lib/api/types";
import { inviteAdmin, resetAdminPassword, updateAdmin } from "@/app/(admin)/admin/people-actions";

type Admin = Schemas["AdminAccountListItemDto"];

const input =
  "border-text/16 bg-ops-surface text-text placeholder:text-text/45 h-10 rounded-xl border px-3 text-[13px] outline-none";

/**
 * The ops team. A new account, or a reset one, gets a one-time password the
 * backend shows exactly once — so it is shown here once, with a plain
 * instruction to hand it over in person or on a call, never in a group chat.
 */
export function TeamBoard({ admins, me, canManage }: { admins: Admin[]; me: string; canManage: boolean }) {
  const [issued, setIssued] = useState<{ name: string; password: string } | null>(null);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState<"MODERATOR" | "SUPER_ADMIN">("MODERATOR");
  const [error, setError] = useState("");
  const [busy, startTransition] = useTransition();

  return (
    <div className="flex flex-wrap items-start gap-3.5">
      <section className="bg-ops-surface min-w-0 flex-[3_1_460px] rounded-[15px]">
        {admins.map((a) => {
          const self = a.email.toLowerCase() === me.toLowerCase();
          return (
            <div key={a.id} className="border-text/6 flex flex-col gap-2.5 border-b px-lg py-3.5 last:border-b-0">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <span className="flex min-w-0 flex-col gap-1">
                  <span className="text-text text-[14px] font-semibold">
                    {a.name}
                    {self && <span className="text-text/55 font-light"> · you</span>}
                  </span>
                  <span className="text-text/55 truncate text-[12px] font-light">
                    {a.email} · added {whenLabel(a.createdAt)}
                    {a.invitedBy ? ` by ${a.invitedBy.name}` : ""}
                  </span>
                </span>
                <span className="flex items-center gap-2">
                  <StatusChip tone={a.adminRole === "SUPER_ADMIN" ? "info" : "muted"}>
                    {a.adminRole === "SUPER_ADMIN" ? "Super admin" : "Moderator"}
                  </StatusChip>
                  {a.status === "REVOKED" && <StatusChip tone="danger">Revoked</StatusChip>}
                </span>
              </div>

              {canManage && !self && (
                <div className="flex flex-wrap gap-2">
                  {a.status === "ACTIVE" ? (
                    <>
                      <ConfirmAction
                        size="sm"
                        tone="line"
                        label={a.adminRole === "SUPER_ADMIN" ? "Make moderator" : "Make super admin"}
                        title={a.adminRole === "SUPER_ADMIN" ? `Make ${a.name} a moderator?` : `Make ${a.name} a super admin?`}
                        text={
                          a.adminRole === "SUPER_ADMIN"
                            ? "They keep running the shift but can no longer send payouts, refunds or manage the team."
                            : "They'll be able to send payouts and refunds and manage the team."
                        }
                        confirm="Change role"
                        run={() => updateAdmin(a.id, { adminRole: a.adminRole === "SUPER_ADMIN" ? "MODERATOR" : "SUPER_ADMIN" })}
                      />
                      <ConfirmAction
                        size="sm"
                        tone="line"
                        label="Reset password"
                        title={`Reset ${a.name}'s password?`}
                        text="They're signed out everywhere and get a one-time password you'll see once."
                        confirm="Reset"
                        run={async () => {
                          const result = await resetAdminPassword(a.id);
                          if (!result.ok) return result;
                          setIssued({ name: a.name, password: result.temporaryPassword });
                          return { ok: true, message: "New password issued" };
                        }}
                      />
                      <ConfirmAction
                        size="sm"
                        tone="bad"
                        label="Revoke access"
                        title={`Revoke ${a.name}'s access?`}
                        text="They're signed out immediately and can't sign back in until restored."
                        confirm="Revoke"
                        run={() => updateAdmin(a.id, { status: "REVOKED" })}
                      />
                    </>
                  ) : (
                    <ConfirmAction
                      size="sm"
                      tone="go"
                      label="Restore access"
                      title={`Restore ${a.name}'s access?`}
                      confirm="Restore"
                      run={() => updateAdmin(a.id, { status: "ACTIVE" })}
                    />
                  )}
                </div>
              )}
            </div>
          );
        })}
      </section>

      {canManage && (
        <aside data-theme="light" className="bg-ops-surface text-text flex min-w-0 max-w-full flex-[2_1_360px] flex-col gap-3 rounded-[15px] p-[22px]">
          {issued ? (
            <>
              <h2 className="text-[17px] font-bold tracking-[-0.02em]">One-time password for {issued.name}</h2>
              <code className="bg-text/6 rounded-xl px-3.5 py-3 text-[15px] font-bold tracking-[0.04em] break-all select-all">
                {issued.password}
              </code>
              <p className="text-text/72 text-[12.5px]/[1.5]">
                This is shown once. Give it to them in person or on a call — not in a group chat. They choose their
                own password after signing in.
              </p>
              <button
                type="button"
                onClick={() => setIssued(null)}
                className="bg-text text-ops-surface h-10 self-start rounded-pill px-[18px] text-[13px] font-bold"
              >
                I&rsquo;ve handed it over
              </button>
            </>
          ) : (
            <form
              className="flex flex-col gap-3"
              onSubmit={(e) => {
                e.preventDefault();
                if (name.trim().length < 2 || !/^\S+@\S+\.\S+$/.test(email)) {
                  return setError("Add their name and work email.");
                }
                setError("");
                startTransition(async () => {
                  const result = await inviteAdmin({ name, email, adminRole: role });
                  if (!result.ok) return setError(result.error);
                  setIssued({ name: result.name, password: result.temporaryPassword });
                  say(`${result.name} added`);
                  setName("");
                  setEmail("");
                  setRole("MODERATOR");
                });
              }}
            >
              <h2 className="text-[17px] font-bold tracking-[-0.02em]">Add someone to ops</h2>
              <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Full name" className={input} />
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="name@karrigo.app" className={input} />
              <select value={role} onChange={(e) => setRole(e.target.value as typeof role)} className={input}>
                <option value="MODERATOR">Moderator — runs the shift</option>
                <option value="SUPER_ADMIN">Super admin — also moves money</option>
              </select>
              {error && <p className="text-danger text-[12.5px] font-medium">{error}</p>}
              <button type="submit" disabled={busy} className="bg-accent text-on-accent h-10 self-start rounded-pill px-[18px] text-[13px] font-bold disabled:opacity-40">
                {busy ? "Adding…" : "Add and get password"}
              </button>
            </form>
          )}
        </aside>
      )}
    </div>
  );
}
