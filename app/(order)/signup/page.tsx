import type { Metadata } from "next";
import { AuthForm } from "@/components/order/AuthForm";

export const metadata: Metadata = { title: "Sign up · Karrigo" };

export default async function Page({ searchParams }: PageProps<"/signup">) {
  const { next } = await searchParams;
  return <AuthForm mode="signup" next={typeof next === "string" ? next : undefined} />;
}
