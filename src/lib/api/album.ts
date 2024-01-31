import { ApiGetAlbumById, ApiGetAlbumTracksById } from "../models/album";

export async function getAlbumById(id: string) {
  const res = await fetch(`http://localhost:3000/api/v1/albums/${id}`);
  const data = await res.json();

  return (await ApiGetAlbumById.parseAsync(data)).data;
}

export async function getAlbumTracksById(id: string) {
  const res = await fetch(`http://localhost:3000/api/v1/albums/${id}/tracks`);
  const data = await res.json();

  return (await ApiGetAlbumTracksById.parseAsync(data)).data;
}
