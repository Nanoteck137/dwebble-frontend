import { error } from "@sveltejs/kit";
import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = async ({ locals, url }) => {
  const query: Record<string, string> = {};
  const filter = url.searchParams.get("filter");
  if (filter) {
    query["filter"] = filter;
  }

  const tracks = await locals.apiClient.getTracks({ query });
  if (tracks.status === "error") {
    if (tracks.error.code === 400) {
      return {
        tracks: [],
        filter,
        filterError: tracks.error.message,
      };
    }
    throw error(tracks.error.code, tracks.error.message);
  }

  return {
    tracks: tracks.data.tracks,
    filter,
  };
};
