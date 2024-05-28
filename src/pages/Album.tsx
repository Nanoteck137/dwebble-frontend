import { useParams } from "@solidjs/router";
import { createQuery } from "@tanstack/solid-query";
import { For, Suspense } from "solid-js";
import { useApiClient } from "../context/ApiClient";
import { useMusicManager } from "../context/MusicManager";
import { Track } from "../lib/musicManager";
import { formatTime } from "../lib/utils";

const Album = () => {
  const params = useParams<{ id: string }>();
  const apiClient = useApiClient();

  const query = createQuery(() => ({
    queryKey: ["albums", params.id],
    queryFn: async () => {
      const album = await apiClient.getAlbumById(params.id);
      if (album.status === "error") throw new Error(album.error.message);

      const tracks = await apiClient.getAlbumTracksById(album.data.id);
      if (tracks.status === "error") throw new Error(tracks.error.message);

      return {
        ...album.data,
        tracks: tracks.data.tracks,
      };
    },
  }));

  const musicManager = useMusicManager();

  return (
    <>
      <p>Album Page: {params.id}</p>

      <Suspense fallback={<p>Loading...</p>}>
        <p>Album Id: {query.data?.id}</p>
        <p>Album Name: {query.data?.name}</p>
        <p>Album Picture: {query.data?.coverArt}</p>
        <p>Album Artist: {query.data?.artistId}</p>

        <img class="h-48" src={query.data?.coverArt} alt="Cover Art" />

        <button
          onClick={() => {
            const tracks: Track[] = query.data!.tracks.map((t) => ({
              name: t.name,
              artistName: t.artistName,
              source: t.mobileQualityFile,
              coverArt: t.coverArt,
            }));
            tracks.forEach((t) => musicManager.addTrackToQueue(t));
            musicManager.requestPlay();
          }}
        >
          Add to queue
        </button>
        <For each={query.data?.tracks}>
          {(track) => {
            return (
              <p>
                {track.number} - {track.name} - {formatTime(track.duration)}
              </p>
            );
          }}
        </For>
      </Suspense>
    </>
  );
};

export default Album;
