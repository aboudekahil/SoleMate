"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.user_login_schema = exports.user_signup_schema = void 0;
const zod_1 = require("zod");
const client_1 = require("@prisma/client");
exports.user_signup_schema = zod_1.z
    .object({
    apartment: zod_1.z.string().min(3),
    building: zod_1.z.string().min(3),
    city: zod_1.z.string().min(3),
    email_address: zod_1.z.string().email(),
    family_name: zod_1.z.string().min(3),
    name: zod_1.z.string().min(3),
    password: zod_1.z.string().min(8),
    payment_option: zod_1.z.nativeEnum(client_1.users_payment_option),
    payment_values: zod_1.z.object({
        OMT: zod_1.z.string().min(3).nullish(),
        Whish: zod_1.z.string().min(3).nullish(),
    }),
    phone_number: zod_1.z.string().min(8).max(12),
    street: zod_1.z.string().min(3),
})
    .refine((data) => {
    const whish_check = data.payment_option === "Whish" &&
        "Whish" in data.payment_values &&
        !data.payment_values.OMT;
    const omt_check = data.payment_option === "OMT" &&
        "OMT" in data.payment_values &&
        !data.payment_values.Whish;
    const both_check = data.payment_option === "Both" &&
        "OMT" in data.payment_values &&
        "Whish" in data.payment_values;
    return whish_check || omt_check || both_check;
}, {
    message: "Payment values do not match payment options",
    path: ["payment_option"],
});
exports.user_login_schema = zod_1.z.object({
    email_address: zod_1.z.string().email(),
    password: zod_1.z.string().min(8),
});
