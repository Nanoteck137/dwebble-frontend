import { useParams } from "@solidjs/router";
import {
  createMutation,
  createQuery,
  useQueryClient,
} from "@tanstack/solid-query";
import { Suspense, createEffect, createSignal } from "solid-js";
import { useApiClient } from "../context/ApiClient";
import { TrackList } from "../lib/components/TrackList";
import { Track } from "../lib/models/apiGen";

const ViewPlaylist = () => {
  const params = useParams<{ id: string }>();

  const apiClient = useApiClient();
  const queryClient = useQueryClient();

  const playlist = createQuery(() => ({
    queryKey: ["playlists", params.id],
    queryFn: async () => {
      const playlist = await apiClient.getPlaylistById(params.id);
      if (playlist.status === "error") throw new Error(playlist.error.message);

      return playlist.data;
    },
  }));

  const movePlaylistItem = createMutation(() => ({
    mutationFn: async (data: {
      playlistId: string;
      itemIndex: number;
      beforeIndex: number;
    }) => {
      apiClient.movePlaylistItem(data.playlistId, {
        itemIndex: data.itemIndex,
        beforeIndex: data.beforeIndex,
      });
    },

    onSuccess: () => {
      // queryClient.invalidateQueries({
      //   queryKey: ["playlists"],
      // });
    },
  }));

  const [tracks, setTracks] = createSignal<Track[]>([]);

  createEffect(() => {
    if (!playlist.data) return;

    setTracks(playlist.data.items);
  });

  const [editMode, setEditMode] = createSignal(false);

  return (
    <Suspense fallback={<p>Loading...</p>}>
      <TrackList
        type={editMode() ? "playlist_edit" : "playlist"}
        name={playlist.data?.name || ""}
        tracks={playlist.data?.items || []}
        onEditClicked={() => setEditMode(true)}
        onSaveClicked={() => setEditMode(false)}
        onCancelClicked={() => setEditMode(false)}
        onMoveItem={(from, to) => {
          if (!playlist.data) return;

          const fromItem = playlist.data.items[from];
          const toItem = playlist.data.items[to];

          console.log(from, to);

          movePlaylistItem.mutate({
            playlistId: playlist.data.id,
            itemIndex: fromItem.number,
            beforeIndex: toItem.number,
          });

          playlist.refetch();
        }}
      />
    </Suspense>
  );
};

export default ViewPlaylist;
