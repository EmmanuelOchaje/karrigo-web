import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { AuthForm } from "@/components/order/AuthForm";
import { getCustomer } from "@/lib/shop/session";

export const metadata: Metadata = { title: "Log in · Karrigo", robots: { index: false } };

export default async function Page() {
  if (await getCustomer()) redirect("/kitchens");
  return <AuthForm mode="login" />;
}
