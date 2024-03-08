import { z } from "zod";

export function createApiResponse<
  Data extends z.ZodTypeAny,
  Errors extends z.ZodTypeAny,
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

// export const GetArtists = createApiResponse(
//   z.object({
//     artists: z.array(
//       z.object({
//         id: z.string().cuid2(),
//         name: z.string(),
//         picture: z.string().url(),
//       }),
//     ),
//   }),
//   z.undefined(),
// );
// export type GetArtists = z.infer<typeof GetArtists>;

// export const GetArtistById = createApiResponse(
//   z.object({
//     id: z.string().cuid2(),
//     name: z.string(),
//     picture: z.string().url(),
//   }),
//   z.undefined(),
// );

// export const GetArtistAlbumsById = createApiResponse(
//   z.object({
//     albums: z.array(
//       z.object({
//         id: z.string().cuid2(),
//         name: z.string(),
//         coverArt: z.string().url(),
//         artistId: z.string().cuid2(),
//       }),
//     ),
//   }),
//   z.undefined(),
// );

// export const GetAlbumById = createApiResponse(
//   z.object({
//     id: z.string().cuid2(),
//     name: z.string(),
//     coverArt: z.string().url(),
//     artistId: z.string().cuid2(),
//   }),
//   z.undefined(),
// );

// export const GetAlbumTracksById = createApiResponse(
//   z.object({
//     tracks: z.array(
//       z.object({
//         id: z.string().cuid2(),
//         number: z.number(),
//         name: z.string(),
//         coverArt: z.string().url(),
//         duration: z.number(),
//         bestQualityFile: z.string().url(),
//         mobileQualityFile: z.string().url(),
//         albumId: z.string().cuid2(),
//         artistId: z.string().cuid2(),
//         albumName: z.string(),
//         artistName: z.string(),
//       }),
//     ),
//   }),
//   z.undefined(),
// );
