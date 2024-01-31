import { z } from "zod";
import { createApiResponse } from "./api";

export const ApiArtist = z.object({
  id: z.string().cuid2(),
  name: z.string(),
  picture: z.string().url(),
});
export type ApiArtist = z.infer<typeof ApiArtist>;

export const ApiGetArtists = createApiResponse(
  z.object({
    artists: z.array(ApiArtist),
  }),
);
export type ApiGetArtists = z.infer<typeof ApiGetArtists>;
