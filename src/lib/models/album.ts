import { z } from "zod";
import { createApiResponse } from "./api";

export const ApiAlbum = z.object({
  id: z.string().cuid2(),
  name: z.string(),
  // TODO(patrik): This should be .url()
  coverArt: z.string(),
  artistId: z.string().cuid2(),
});
export type ApiAlbum = z.infer<typeof ApiAlbum>;

export const ApiGetAlbumById = createApiResponse(ApiAlbum);
export type ApiGetAlbumById = z.infer<typeof ApiGetAlbumById>;

export const ApiGetAlbumTracksById = createApiResponse(
  z.object({
    tracks: z.array(
      z.object({
        id: z.string().cuid2(),
        number: z.number(),
        name: z.string(),
        coverArt: z.string(),
        bestQualityFile: z.string().url(),
        mobileQualityFile: z.string().url(),
        albumId: z.string().cuid2(),
        artistId: z.string().cuid2(),
      }),
    ),
  }),
);
