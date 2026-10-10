/**
 * Where a partner staff member works, for ops screens (tickets, audit log).
 *
 * Staff used to belong to a kitchen, so responses carried `staff.kitchen`.
 * They now belong to a business, which may have a kitchen, a store, or both:
 * responses carry `staff.business.{ name, kitchen }` and the kitchen can be
 * null (a store-only business). Both shapes are read here, so the ops panel
 * works whichever side of the backend deploy it ships on.
 */
export type StaffWithWorkplace = {
  name: string;
  /** The shape before the business model. */
  kitchen?: { name: string } | null;
  /** The shape since. */
  business?: { name: string; kitchen?: { name: string } | null } | null;
};

/** The kitchen's name if there is one, else the business's, else nothing. */
export function staffWorkplace(staff: StaffWithWorkplace): string | null {
  return staff.kitchen?.name ?? staff.business?.kitchen?.name ?? staff.business?.name ?? null;
}

/** "Ada (Mama Put)", or just "Ada" when we do not know where they work. */
export function staffLabel(staff: StaffWithWorkplace): string {
  const where = staffWorkplace(staff);
  return where ? `${staff.name} (${where})` : staff.name;
}
