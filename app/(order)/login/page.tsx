import type { Metadata } from "next";
import { AuthForm } from "@/components/order/AuthForm";

export const metadata: Metadata = { title: "Log in · Karrigo" };

export default async function Page({ searchParams }: PageProps<"/login">) {
  const { next } = await searchParams;
  return <AuthForm mode="login" next={typeof next === "string" ? next : undefined} />;
}
