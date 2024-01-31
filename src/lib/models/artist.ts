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

export const ApiGetArtistById = createApiResponse(ApiArtist);
export type ApiGetArtistById = z.infer<typeof ApiGetArtistById>;

export const ApiGetArtistAlbumsById = createApiResponse(
  z.object({
    albums: z.array(
      z.object({
        id: z.string().cuid2(),
        name: z.string(),
        coverArt: z.string().url(),
        artistId: z.string().cuid2(),
      }),
    ),
  }),
);
export type ApiGetArtistAlbumsById = z.infer<typeof ApiGetArtistAlbumsById>;
