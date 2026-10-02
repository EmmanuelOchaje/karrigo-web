import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { KitchenMenu } from "@/components/order/KitchenMenu";
import { getKitchenMenu } from "@/lib/shop/catalog";

/** Rendered fresh on every request: a kitchen changes a price or sells out
 *  and the next person to open the page sees it. */
export async function generateMetadata({ params }: PageProps<"/k/[slug]">): Promise<Metadata> {
  const menu = await getKitchenMenu((await params).slug);
  return { title: menu ? `${menu.name} · Karrigo` : "Kitchen not found · Karrigo" };
}

export default async function KitchenPage({ params }: PageProps<"/k/[slug]">) {
  const menu = await getKitchenMenu((await params).slug);
  if (!menu) notFound();
  return <KitchenMenu menu={menu} />;
}
