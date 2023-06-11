"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.shoe_create_schema = void 0;
const zod_1 = require("zod");
const client_1 = require("@prisma/client");
exports.shoe_create_schema = zod_1.z.object({
    name: zod_1.z.string(),
    condition: zod_1.z.nativeEnum(client_1.shoes_condition),
    color: zod_1.z.string(),
    sizes: zod_1.z
        .array(zod_1.z.object({
        shoe_size: zod_1.z.number().int().min(1),
        price: zod_1.z.number().int().min(1),
        quantity: zod_1.z.number().int().min(1),
    }))
        .nonempty(),
    fit: zod_1.z.nativeEnum(client_1.shoe_fit),
});
