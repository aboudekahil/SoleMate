import { z } from "zod";

export const review_create_schema = z.object({
  customer_service_rating: z.number().int().min(0).max(5),
  shipping_time_rating: z.number().int().min(0).max(5),
  shipping_quality_rating: z.number().int().min(0).max(5),
  website_performance_rating: z.number().int().min(0).max(5),
  shoe_id: z.string().uuid(),
});

export type CreateReviewBody = z.infer<typeof review_create_schema>;
