import { z } from "zod";
import { users_payment_option } from "@prisma/client";

export const user_signup_schema = z.object({
  apartment: z.string().min(3),
  building: z.string().min(3),
  city: z.string().min(3),
  email_address: z.string().email(),
  family_name: z.string().min(3),
  name: z.string().min(3),
  password: z.string().min(8),
  payment_option: z.nativeEnum(users_payment_option),
  payment_values: z.object({
    OMT: z.optional(z.string().min(3)),
    Whish: z.optional(z.string().min(3)),
  }),
  phone_number: z.string().min(10),
  street: z.string().min(3),
});

export type UserSignupBody = z.infer<typeof user_signup_schema>;

export const user_login_schema = z.object({
  email_address: z.string().email(),
  password: z.string().min(8),
});

export type UserLoginBody = z.infer<typeof user_login_schema>;
