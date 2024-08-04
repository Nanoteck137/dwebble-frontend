import { ApiClient } from "$lib/api/client";
import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = async () => {
  const client = new ApiClient("http://10.28.28.6:3000");

  const tracks = await client.getTracks();
  if (tracks.status === "error") throw tracks.error.message;

  return {
    tracks: tracks.data.tracks,
  };
};
