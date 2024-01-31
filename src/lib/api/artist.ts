import { ApiGetArtists } from "../models/artist";

export async function getArtists() {
  const res = await fetch("http://localhost:3000/api/v1/artists");
  const data = await res.json();

  return (await ApiGetArtists.parseAsync(data)).data;
}
