import { z } from "zod";
import { shoe_fit, shoes_condition } from "@prisma/client";

export const shoe_create_schema = z.object({
  name: z.string(),
  condition: z.nativeEnum(shoes_condition),
  color: z.string(),
  sizes: z
    .array(
      z.object({
        shoe_size: z.number().int().min(1),
        price: z.number().int().min(1),
        quantity: z.number().int().min(1),
      })
    )
    .nonempty(),
  fit: z.nativeEnum(shoe_fit),
});

export type ShoeCreateBody = z.infer<typeof shoe_create_schema>;
