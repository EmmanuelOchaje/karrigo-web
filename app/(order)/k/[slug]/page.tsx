import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { KitchenMenu } from "@/components/order/KitchenMenu";
import { getKitchenMenu } from "@/lib/shop/catalog";
import type { Side } from "@/lib/shop/types";

const sideOf = (type: string | string[] | undefined): Side => (type === "GROCERY" ? "GROCERY" : "FOOD");

/** Rendered fresh on every request: a kitchen changes a price or sells out
 *  and the next person to open the page sees it. `?type=GROCERY` opens the
 *  grocery side of a place that serves both. */
export async function generateMetadata({ params, searchParams }: PageProps<"/k/[slug]">): Promise<Metadata> {
  const menu = await getKitchenMenu((await params).slug, sideOf((await searchParams).type));
  return { title: menu ? `${menu.name} · Karrigo` : "Not found · Karrigo" };
}

export default async function KitchenPage({ params, searchParams }: PageProps<"/k/[slug]">) {
  const menu = await getKitchenMenu((await params).slug, sideOf((await searchParams).type));
  if (!menu) notFound();
  return <KitchenMenu menu={menu} />;
}
