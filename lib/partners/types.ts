/** An application as the applicant sees it: what is done, what is missing,
 *  and what ops said. Safe in client components. */

export type Bank = { name: string; code: string };

export type KitchenApplication = {
  name: string;
  status: "PENDING" | "ACTIVE" | "SUSPENDED";
  /** Why ops sent it back. Shown to the kitchen, word for word. */
  note: string | null;
  area: string | null;
  landmarkNote: string | null;
  hasLocation: boolean;
  /** The account holder's name as the bank returned it — the confirmation
   *  that the number is the right one. */
  bankAccountName: string | null;
  bankAccountLast4: string | null;
  imageUrl: string | null;
  dishes: { id: string; name: string; priceKobo: number }[];
};

export type RiderApplication = {
  status: "PENDING" | "APPROVED" | "REJECTED";
  note: string | null;
  vehicleType: string | null;
  plateNumber: string | null;
  documents: { license: boolean; id: boolean; vehicleReg: boolean };
  guarantor: { name: string; phone: string; address: string } | null;
  bankAccountName: string | null;
  bankAccountLast4: string | null;
};

export type DocumentKind = keyof RiderApplication["documents"];
