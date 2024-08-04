import { error } from "@sveltejs/kit";
import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = async ({ locals }) => {
  const albums = await locals.apiClient.getAlbums();
  if (albums.status === "error") {
    throw error(500, "Server Error");
  }

  return {
    albums: albums.data.albums,
  };
};
