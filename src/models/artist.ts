import { z } from "zod";

export const Artist = z.object({
  id: z.string(),
  name: z.string(),
  picture: z.string(),
});

export type Artist = z.infer<typeof Artist>;
