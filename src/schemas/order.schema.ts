import { z } from "zod";

export const order_place_schema = z.object({
  shoe_id: z.string().uuid(),
});

export type PlaceOrderBody = z.infer<typeof order_place_schema>;
