import { OrderNav } from "@/components/order/OrderNav";
import { Toast } from "@/components/order/Toast";
import { APPLICATION, CONSOLE, getKitchen } from "@/lib/kitchen/data";
import { getCustomer } from "@/lib/shop/session";

/** The ordering web app: kitchens, menus, checkout, sign-in and tracking.
 *  Who is signed in is read here, on the server, so the header is right on
 *  the first paint and cannot be faked from the browser. */
export default async function OrderLayout({ children }: LayoutProps<"/">) {
  // The header's "who is signed in" must never take the whole page down: if
  // the backend can't be reached just now, show it as signed out. The page
  // itself still reports its own failure, with a way to try again.
  const [customer, kitchen] = await Promise.all([getCustomer().catch(() => null), getKitchen().catch(() => null)]);
  return (
    <div className="bg-surface grow">
      <OrderNav
        user={customer ? { name: customer.name } : null}
        kitchen={kitchen ? { href: kitchen.status === "ACTIVE" ? CONSOLE : APPLICATION } : null}
      />
      <main className="px-screen-x pt-lg pb-section-sm">{children}</main>
      <Toast />
    </div>
  );
}
