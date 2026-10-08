/** An application as the applicant sees it: what is done, what is missing,
 *  and what ops said. Safe in client components. */

export type Bank = { name: string; code: string };

export type KitchenApplication = {
  name: string;
  status: "PENDING" | "ACTIVE" | "SUSPENDED";
  /** Why ops sent it back. Shown to the kitchen, word for word. */
  note: string | null;
  /** The owner's one appeal against a suspension, and when it was sent. */
  appealNote: string | null;
  appealedAt: string | null;
  area: string | null;
  landmarkNote: string | null;
  hasLocation: boolean;
  /** The account holder's name as the bank returned it — the confirmation
   *  that the number is the right one. */
  bankAccountName: string | null;
  bankAccountLast4: string | null;
  imageUrl: string | null;
  /** Whether the signed-in staff member owns the kitchen; only owners can
   *  add or remove the verification photos. */
  isOwner: boolean;
  /** Null until the owner has set it. */
  riderBaseFeeKobo: number | null;
  verificationPhotoCount: number;
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
