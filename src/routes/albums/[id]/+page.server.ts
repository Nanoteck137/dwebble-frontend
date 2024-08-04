import { error } from "@sveltejs/kit";
import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = async ({ params, locals }) => {
  const album = await locals.apiClient.getAlbumById(params.id);
  if (album.status === "error") {
    throw error(500, album.error.message);
  }

  const tracks = await locals.apiClient.getAlbumTracks(params.id);
  if (tracks.status === "error") {
    throw error(500, tracks.error.message);
  }

  return {
    album: album.data,
    tracks: tracks.data.tracks,
  };
};
