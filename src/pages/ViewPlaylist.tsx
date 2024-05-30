import { useParams } from "@solidjs/router";
import { createQuery } from "@tanstack/solid-query";
import { Suspense } from "solid-js";
import { useApiClient } from "../context/ApiClient";
import { TrackList } from "../lib/components/TrackList";

const ViewPlaylist = () => {
  const params = useParams<{ id: string }>();

  const apiClient = useApiClient();

  const playlist = createQuery(() => ({
    queryKey: ["playlists", params.id],
    queryFn: async () => {
      const playlist = await apiClient.getPlaylistById(params.id);
      if (playlist.status === "error") throw new Error(playlist.error.message);

      return playlist.data;
    },
  }));

  return (
    <Suspense fallback={<p>Loading...</p>}>
      <TrackList
        type="playlist"
        name={playlist.data?.name || ""}
        tracks={playlist.data?.items || []}
      />
    </Suspense>
  );
};

export default ViewPlaylist;
