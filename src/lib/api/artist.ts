import {
  ApiGetArtistAlbumsById,
  ApiGetArtistById,
  ApiGetArtists,
} from "../models/artist";

export async function getArtists() {
  const res = await fetch("http://localhost:3000/api/v1/artists");
  const data = await res.json();

  return (await ApiGetArtists.parseAsync(data)).data;
}

export async function getArtistById(id: string) {
  const res = await fetch(`http://localhost:3000/api/v1/artists/${id}`);
  const data = await res.json();

  return (await ApiGetArtistById.parseAsync(data)).data;
}

export async function getArtistAlbumsById(id: string) {
  const res = await fetch(`http://localhost:3000/api/v1/artists/${id}/albums`);
  const data = await res.json();

  return (await ApiGetArtistAlbumsById.parseAsync(data)).data;
}
