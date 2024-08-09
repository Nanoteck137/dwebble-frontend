import { error } from "@sveltejs/kit";
import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = async ({ locals }) => {
  const albums = await locals.apiClient.getAlbums();
  if (albums.status === "error") {
    throw error(albums.error.code, albums.error.message);
  }

  return {
    albums: albums.data.albums,
  };
};
