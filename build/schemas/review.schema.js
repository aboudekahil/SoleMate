"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.review_create_schema = void 0;
const zod_1 = require("zod");
exports.review_create_schema = zod_1.z.object({
    customer_service_rating: zod_1.z.number().int().min(0).max(5),
    shipping_time_rating: zod_1.z.number().int().min(0).max(5),
    shipping_quality_rating: zod_1.z.number().int().min(0).max(5),
    website_performance_rating: zod_1.z.number().int().min(0).max(5),
    shoe_id: zod_1.z.string().uuid(),
});
