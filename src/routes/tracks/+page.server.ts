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
    throw error(500, "Failed to fetch tracks");
  }

  return {
    tracks: tracks.data.tracks,
  };
};
