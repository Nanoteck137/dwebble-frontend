import { AnyZodObject, ZodTypeAny, z } from "zod";

export function createApiResponse<
  Data extends AnyZodObject,
  Errors extends ZodTypeAny,
>(data: Data, errors: Errors) {
  const error = z.object({
    code: z.number(),
    message: z.string(),
    errors,
  });

  return z.discriminatedUnion("status", [
    z.object({ status: z.literal("success"), data }),
    z.object({ status: z.literal("error"), error }),
  ]);
}

export const GetArtists = createApiResponse(
  z.object({
    artists: z.array(
      z.object({
        id: z.string().cuid2(),
        name: z.string(),
        picture: z.string(),
      }),
    ),
  }),
  z.undefined(),
);

export const GetArtistById = createApiResponse(
  z.object({
    id: z.string().cuid2(),
    name: z.string(),
    picture: z.string(),
  }),
  z.undefined(),
);

export const GetArtistAlbumsById = createApiResponse(
  z.object({
    albums: z.array(
      z.object({
        id: z.string().cuid2(),
        name: z.string(),
        coverArt: z.string(),
        artistId: z.string().cuid2(),
      }),
    ),
  }),
  z.undefined(),
);

export const GetAlbumById = createApiResponse(
  z.object({
    id: z.string().cuid2(),
    name: z.string(),
    coverArt: z.string(),
    artistId: z.string().cuid2(),
  }),
  z.undefined(),
);

export const GetAlbumTracksById = createApiResponse(
  z.object({
    tracks: z.array(
      z.object({
        id: z.string().cuid2(),
        number: z.number(),
        name: z.string(),
        coverArt: z.string(),
        duration: z.number(),
        bestQualityFile: z.string().url(),
        mobileQualityFile: z.string().url(),
        albumId: z.string().cuid2(),
        artistId: z.string().cuid2(),
        albumName: z.string(),
        artistName: z.string(),
      }),
    ),
  }),
  z.undefined(),
);
