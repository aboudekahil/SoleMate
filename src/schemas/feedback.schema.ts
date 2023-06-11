import { z } from "zod";

export const send_feedback_schema = z.object({ content: z.string() });

export type SendFeedBackBody = z.infer<typeof send_feedback_schema>;
