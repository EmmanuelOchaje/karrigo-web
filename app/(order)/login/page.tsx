import type { Metadata } from "next";
import { AuthForm } from "@/components/order/AuthForm";

export const metadata: Metadata = { title: "Log in · Karrigo" };

export default function Page() {
  return <AuthForm mode="login" />;
}
