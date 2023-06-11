"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.user_login_schema = exports.user_signup_schema = exports.shoe_sizes_schema = void 0;
const zod_1 = require("zod");
exports.shoe_sizes_schema = zod_1.z
    .array(zod_1.z.object({
    shoe_size: zod_1.z.number().int().min(1),
    price: zod_1.z.number().int().min(1),
    quantity: zod_1.z.number().int().min(1),
}))
    .nonempty();
exports.user_signup_schema = zod_1.z.object({
    apartment: zod_1.z.string().min(3),
    building: zod_1.z.string().min(3),
    city: zod_1.z.string().min(3),
    email_address: zod_1.z.string().email(),
    family_name: zod_1.z.string().min(3),
    name: zod_1.z.string().min(3),
    password: zod_1.z.string().min(8),
    payment_option: zod_1.z.enum(["Whish", "OMT", "Both"]),
    payment_values: zod_1.z.object({
        OMT: zod_1.z.optional(zod_1.z.string().min(3)),
        Whish: zod_1.z.optional(zod_1.z.string().min(3)),
    }),
    phone_number: zod_1.z.string().min(10),
    street: zod_1.z.string().min(3),
});
exports.user_login_schema = zod_1.z.object({
    email_address: zod_1.z.string().email(),
    password: zod_1.z.string().min(8),
});
