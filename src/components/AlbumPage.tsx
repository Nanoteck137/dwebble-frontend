import type { Component } from "solid-js";
import type { Album } from "src/models/album";
import { Track } from "src/models/track";
import { z } from "zod";
import { audioHandler } from "./AudioHandler";

const AlbumPage: Component<{ album: Album; tracks: Track[] }> = (props) => {
  const { album, tracks } = props;

  const playAlbum = async () => {
    const body = {
      albumId: album.id,
    };

    const Response = z.object({
      queue: z.array(Track),
    });

    const res = await fetch("http://localhost:3000/api/v1/queue/album", {
      method: "POST",
      body: JSON.stringify(body),
      headers: {
        "Content-Type": "application/json",
      },
    });
    const queue = Response.parse(await res.json());
    audioHandler?.setQueue(queue.queue);
  };

  return (
    <>
      <p>{album.name}</p>
      <button onClick={playAlbum}>Play Album</button>

      <div>
        {tracks.map((track) => {
          return (
            <div>
              <p>{track.name}</p>
            </div>
          );
        })}
      </div>
    </>
  );
};

export default AlbumPage;
