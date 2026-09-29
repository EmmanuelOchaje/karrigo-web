import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { KitchenMenu } from "@/components/order/KitchenMenu";
import { findKitchen, kitchens } from "@/lib/fixtures";

export function generateStaticParams() {
  return kitchens.map((kitchen) => ({ slug: kitchen.slug }));
}

export async function generateMetadata({ params }: PageProps<"/k/[slug]">): Promise<Metadata> {
  const kitchen = findKitchen((await params).slug);
  return { title: kitchen ? `${kitchen.name} · Karrigo` : "Kitchen not found · Karrigo" };
}

export default async function KitchenPage({ params }: PageProps<"/k/[slug]">) {
  const kitchen = findKitchen((await params).slug);
  if (!kitchen) notFound();
  return <KitchenMenu kitchen={kitchen} />;
}
