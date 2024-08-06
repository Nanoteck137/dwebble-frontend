import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = async ({ locals }) => {
  const tracks = await locals.apiClient.getTracks();
  if (tracks.status === "error") throw tracks.error.message;

  return {
    tracks: tracks.data.tracks,
  };
};
