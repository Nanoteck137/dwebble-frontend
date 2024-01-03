import { createResource, type Component, Show } from "solid-js";
import type { Artist, ArtistFetchResponse } from "../models/artist";

async function fetchArtists() {
  const artists: ArtistFetchResponse = await fetch(
    "http://localhost:3000/api/v1/artists"
  ).then((d) => d.json());
  return artists;
}

const Test: Component<{ artists: Artist[]; onClick?: () => void }> = (
  props
) => {
  const [artists, { mutate }] = createResource(fetchArtists);

  return (
    <>
      <Show when={artists.loading && !artists.error}>
        <p>Loading...</p>
      </Show>

      <Show when={artists.error}>
        <p>Error</p>
      </Show>

      <Show when={artists.state === "ready"}>
        {artists()!.artists.map((artist) => {
          return <p onClick={props.onClick}>{artist.name}</p>;
        })}
      </Show>
    </>
  );
};

export default Test;
