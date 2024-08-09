import { error } from "@sveltejs/kit";
import type { Actions, PageServerLoad } from "./$types";

export const load: PageServerLoad = async ({ locals }) => {
  const playlists = await locals.apiClient.getPlaylists();
  if (playlists.status === "error") {
    throw error(playlists.error.code, playlists.error.message);
  }

  return {
    playlists: playlists.data.playlists,
  };
};

export const actions = {
  default: async ({ locals, request }) => {
    const formData = await request.formData();

    // TODO(patrik): Fix, remove !
    const playlistName = formData.get("name")!.toString();
    const res = await locals.apiClient.createPlaylist({ name: playlistName });
    if (res.status === "error") {
      throw error(res.error.code, res.error.message);
    }

    return {
      success: true,
    };
  },
} satisfies Actions;
