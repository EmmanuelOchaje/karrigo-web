import { z } from "zod";

/** Shared by the forms and checked again on the server by karrigo-be. */

const phone = z
  .string()
  .transform((value) => value.replace(/\D/g, ""))
  .refine((digits) => /^0\d{10}$/.test(digits) || /^234\d{10}$/.test(digits), {
    message: "Enter an 11-digit phone number, like 0803 123 4567.",
  });

// The backend asks for 8–72 characters.
const password = z
  .string()
  .min(8, { message: "Password needs at least 8 characters." })
  .max(72, { message: "Password can be at most 72 characters." });

export const loginSchema = z.object({
  phone,
  password: z.string().min(1, { message: "Enter your password." }),
});

export const signupSchema = z.object({
  name: z.string().trim().min(2, { message: "Enter your name." }),
  phone,
  password,
});

export const resetSchema = z.object({ phone, password });

export const codeSchema = z
  .string()
  .regex(/^\d{6}$/, { message: "Enter the 6-digit code we sent you." });

/** The areas Karrigo delivers to today. */
export const AREAS = [
  "High Level",
  "Wurukum",
  "North Bank",
  "Wadata",
  "Modern Market",
  "Old GRA",
  "Kanshio",
] as const;

export const deliverySchema = z
  .object({
    landmark: z.string().trim(),
    address: z.string().trim(),
    area: z.string().trim().min(1, { message: "Pick the area you're in." }),
    note: z.string().trim().max(200),
  })
  .refine((d) => d.landmark.length >= 3 || d.address.length >= 3, {
    message: "Add an address or a landmark so your rider can find you.",
  });

/** The first message from a failed parse — forms show one thing at a time. */
export function firstIssue(error: z.ZodError): string {
  return error.issues[0]?.message ?? "Something is not right there.";
}
