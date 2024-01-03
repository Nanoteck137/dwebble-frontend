export interface Artist {
  id: string;
  name: string;
  picture: string;
}

export interface ArtistFetchResponse {
  artists: Artist[];
}
