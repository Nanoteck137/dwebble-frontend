import { Navigate, useParams } from "@solidjs/router";
import {
  createMutation,
  createQuery,
  useQueryClient,
} from "@tanstack/solid-query";
import { Show, Suspense, createSignal } from "solid-js";
import { useApiClient } from "~/context/ApiClient";
import { useAuth } from "~/context/AuthContext";
import { TrackList } from "~/lib/components/TrackList";

const ViewPlaylist = () => {
  const params = useParams<{ id: string }>();

  const apiClient = useApiClient();
  const auth = useAuth();
  const queryClient = useQueryClient();

  const user = auth.user();

  const playlist = createQuery(() => ({
    queryKey: ["playlists", params.id],
    queryFn: async () => {
      const playlist = await apiClient.getPlaylistById(params.id);
      if (playlist.status === "error") throw new Error(playlist.error.message);

      return playlist.data;
    },
    enabled: !!user(),
  }));

  const movePlaylistItem = createMutation(() => ({
    mutationFn: async (data: {
      playlistId: string;
      trackId: string;
      toIndex: number;
    }) => {
      console.log("Hello");
      const res = await apiClient.movePlaylistItem(data.playlistId, {
        trackId: data.trackId,
        toIndex: data.toIndex,
      });

      if (res.status === "error") throw new Error(res.error.message);

      return res.data;
    },

    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ["playlists", params.id],
      });
    },
  }));

  const [editMode, setEditMode] = createSignal(false);

  return (
    <Show when={!!user()} fallback={<Navigate href="/" />}>
      <Suspense fallback={<p>Loading...</p>}>
        <TrackList
          type={editMode() ? "playlist_edit" : "playlist"}
          name={playlist.data?.name || ""}
          tracks={playlist.data?.items || []}
          disableMove={movePlaylistItem.isPending}
          onEditClicked={() => setEditMode(true)}
          onSaveClicked={() => setEditMode(false)}
          onCancelClicked={() => setEditMode(false)}
          onMoveItem={(from, to) => {
            if (!playlist.data) return;

            console.log("OnMoveitem", playlist.data.items);

            const fromItem = playlist.data.items[from];
            const toItem = playlist.data.items[to];

            console.log(from, to);

            movePlaylistItem.mutate({
              playlistId: playlist.data.id,
              trackId: fromItem.id,
              toIndex: toItem.number,
            });
          }}
        />
      </Suspense>
    </Show>
  );
};

export default ViewPlaylist;
