import { useParams } from "@solidjs/router";
import {
  createMutation,
  createQuery,
  useQueryClient,
} from "@tanstack/solid-query";
import { Suspense, createSignal } from "solid-js";
import { useApiClient } from "../context/ApiClient";
import { TrackList } from "../lib/components/TrackList";

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
      console.log("Hello");
      const res = await apiClient.movePlaylistItem(data.playlistId, {
        itemIndex: data.itemIndex,
        beforeIndex: data.beforeIndex,
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
            itemIndex: fromItem.number,
            beforeIndex: toItem.number,
          });
        }}
      />
    </Suspense>
  );
};

export default ViewPlaylist;
