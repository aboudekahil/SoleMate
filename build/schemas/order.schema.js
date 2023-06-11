"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.order_place_schema = void 0;
const zod_1 = require("zod");
exports.order_place_schema = zod_1.z.object({
    shoe_id: zod_1.z.string().uuid(),
});
