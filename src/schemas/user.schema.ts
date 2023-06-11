import { z } from "zod";
import { users_payment_option } from "@prisma/client";

export const user_signup_schema = z
  .object({
    apartment: z.string().min(3),
    building: z.string().min(3),
    city: z.string().min(3),
    email_address: z.string().email(),
    family_name: z.string().min(3),
    name: z.string().min(3),
    password: z.string().min(8),
    payment_option: z.nativeEnum(users_payment_option),
    payment_values: z.object({
      OMT: z.string().min(3).nullish(),
      Whish: z.string().min(3).nullish(),
    }),
    phone_number: z.string().min(8).max(12),
    street: z.string().min(3),
  })
  .refine(
    (data) => {
      const whish_check =
        data.payment_option === "Whish" &&
        "Whish" in data.payment_values &&
        !data.payment_values.OMT;

      const omt_check =
        data.payment_option === "OMT" &&
        "OMT" in data.payment_values &&
        !data.payment_values.Whish;

      const both_check =
        data.payment_option === "Both" &&
        "OMT" in data.payment_values &&
        "Whish" in data.payment_values;

      return whish_check || omt_check || both_check;
    },
    {
      message: "Payment values do not match payment options",
      path: ["payment_option"],
    }
  );

export type UserSignupBody = z.infer<typeof user_signup_schema>;

export const user_login_schema = z.object({
  email_address: z.string().email(),
  password: z.string().min(8),
});

export type UserLoginBody = z.infer<typeof user_login_schema>;
