import { z } from "zod";

export const Track = z.object({
  id: z.string(),
  trackNumber: z.number(),
  name: z.string(),
  coverArt: z.string(),
  filename: z.string(),
  albumId: z.string().cuid2(),
  artistId: z.string().cuid2(),
  albumName: z.string(),
  artistName: z.string(),
});

export type Track = z.infer<typeof Track>;
