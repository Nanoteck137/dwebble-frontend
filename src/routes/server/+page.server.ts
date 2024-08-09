import { error } from "@sveltejs/kit";
import type { Actions, PageServerLoad } from "./$types";

export const load: PageServerLoad = async ({ locals }) => {
  const tracks = await locals.apiClient.getTracks();
  if (tracks.status === "error") {
    throw error(tracks.error.code, tracks.error.message);
  }

  console.log("Getting track data");

  return {
    tracks: tracks.data.tracks,
  };
};

export const actions: Actions = {
  runSync: async ({ locals }) => {
    const res = await locals.apiClient.runSync();
    if (res.status === "error") {
      throw error(res.error.code, res.error.message);
    }
  },
};
