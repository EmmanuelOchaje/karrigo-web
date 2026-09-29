import type { Metadata } from "next";
import { AuthForm } from "@/components/order/AuthForm";

export const metadata: Metadata = { title: "Sign up · Karrigo" };

export default function Page() {
  return <AuthForm mode="signup" />;
}
