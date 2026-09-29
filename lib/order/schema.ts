import { z } from "zod";

/** Shared by the form and, once there is one, the server action. */

const phone = z
  .string()
  .transform((value) => value.replace(/\D/g, ""))
  .refine((digits) => /^0\d{10}$/.test(digits), {
    message: "Enter an 11-digit phone number, like 0803 123 4567.",
  });

const password = z
  .string()
  .min(6, { message: "Password needs at least 6 characters." });

export const loginSchema = z.object({ phone, password });

export const signupSchema = z.object({
  name: z.string().trim().min(2, { message: "Enter your name." }),
  phone,
  password,
});

export const paymentMethods = ["card", "transfer", "cash"] as const;
export type PaymentMethod = (typeof paymentMethods)[number];

export const deliverySchema = z
  .object({
    landmark: z.string().trim(),
    address: z.string().trim(),
    note: z.string().trim().max(200),
    pay: z.enum(paymentMethods),
  })
  .refine((d) => d.landmark.length >= 3 || d.address.length >= 3, {
    message: "Add an address or a landmark so your rider can find you.",
  });

/** The first message from a failed parse — forms show one thing at a time. */
export function firstIssue(error: z.ZodError): string {
  return error.issues[0]?.message ?? "Something is not right there.";
}
