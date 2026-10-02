import { OrderNav } from "@/components/order/OrderNav";
import { Toast } from "@/components/order/Toast";
import { getCustomer } from "@/lib/shop/session";

/** The ordering web app: kitchens, menus, checkout, sign-in and tracking.
 *  Who is signed in is read here, on the server, so the header is right on
 *  the first paint and cannot be faked from the browser. */
export default async function OrderLayout({ children }: LayoutProps<"/">) {
  const customer = await getCustomer();
  return (
    <div className="bg-surface grow">
      <OrderNav user={customer ? { name: customer.name } : null} />
      <main className="px-screen-x pt-lg pb-section-sm">{children}</main>
      <Toast />
    </div>
  );
}
