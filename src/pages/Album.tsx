import { useParams } from "@solidjs/router";
import { createQuery } from "@tanstack/solid-query";
import { Suspense } from "solid-js";
import { useApiClient } from "~/context/ApiClient";
import { TrackList } from "~/lib/components/TrackList";

const Album = () => {
  const params = useParams<{ id: string }>();
  const apiClient = useApiClient();

  const query = createQuery(() => ({
    queryKey: ["albums", params.id],
    queryFn: async () => {
      const album = await apiClient.getAlbumById(params.id);
      if (album.status === "error") throw new Error(album.error.message);

      const tracks = await apiClient.getAlbumTracks(album.data.id);
      if (tracks.status === "error") throw new Error(tracks.error.message);

      return {
        ...album.data,
        tracks: tracks.data.tracks,
      };
    },
  }));

  return (
    <Suspense fallback={<p>Loading...</p>}>
      <TrackList
        type="album"
        name={query.data?.name || ""}
        tracks={query.data?.tracks || []}
      />
    </Suspense>
  );
};

export default Album;
