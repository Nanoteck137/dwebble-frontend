import { z } from "zod";

export const Album = z.object({
  id: z.string(),
  name: z.string(),
  coverArt: z.string(),
  artistId: z.string(),
});

export type Album = z.infer<typeof Album>;
