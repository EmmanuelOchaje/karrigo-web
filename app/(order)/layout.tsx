import { OrderNav } from "@/components/order/OrderNav";
import { Toast } from "@/components/order/Toast";

/** The ordering web app: kitchens, menus, checkout, sign-in and tracking. */
export default function OrderLayout({ children }: LayoutProps<"/">) {
  return (
    <div className="bg-surface grow">
      <OrderNav />
      <main className="px-screen-x pt-lg pb-section-sm">{children}</main>
      <Toast />
    </div>
  );
}
