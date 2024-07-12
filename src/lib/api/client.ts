import { z } from "zod";
import BaseApiClient from "./base-client";
import * as api from "./types";

export class ApiClient extends BaseApiClient {
  constructor(baseUrl: string) {
    super(baseUrl);
  }

  login(body: api.PostAuthSigninBody) {
    return this.request(
      "/api/v1/auth/signin",
      "POST",
      api.PostAuthSignin,
      body,
    );
  }

  register(body: api.PostAuthSignupBody) {
    return this.request(
      "/api/v1/auth/signup",
      "POST",
      api.PostAuthSignup,
      body,
    );
  }

  getArtists() {
    return this.request("/api/v1/artists", "GET", api.GetArtists);
  }

  getArtistById(id: string) {
    return this.request(`/api/v1/artists/${id}`, "GET", api.GetArtistById);
  }

  getArtistAlbumsById(id: string) {
    return this.request(
      `/api/v1/artists/${id}/albums`,
      "GET",
      api.GetArtistAlbumsById,
    );
  }

  getAlbumById(id: string) {
    return this.request(`/api/v1/albums/${id}`, "GET", api.GetAlbumById);
  }

  getAlbumTracksById(id: string) {
    return this.request(
      `/api/v1/albums/${id}/tracks`,
      "GET",
      api.GetAlbumTracksById,
    );
  }

  createRandomQueue() {
    return this.request("/api/v1/queue", "POST", api.GetAlbumTracksById);
  }

  getMe() {
    return this.request("/api/v1/auth/me", "GET", api.GetAuthMe);
  }

  createPlaylist(body: api.PostPlaylistBody) {
    return this.request("/api/v1/playlists", "POST", api.PostPlaylist, body);
  }

  getPlaylists() {
    return this.request("/api/v1/playlists", "GET", api.GetPlaylists);
  }

  getPlaylistById(id: string) {
    return this.request(`/api/v1/playlists/${id}`, "GET", api.GetPlaylistById);
  }

  addItemsToPlaylists(
    playlistId: string,
    body: api.PostPlaylistItemsByIdBody,
  ) {
    return this.request(
      `/api/v1/playlists/${playlistId}/items`,
      "POST",
      z.undefined(),
      body,
    );
  }

  deleteItemsToPlaylists(
    playlistId: string,
    body: api.DeletePlaylistItemsByIdBody,
  ) {
    return this.request(
      `/api/v1/playlists/${playlistId}/items`,
      "POST",
      z.undefined(),
      body,
    );
  }

  movePlaylistItem(
    playlistId: string,
    body: api.PostPlaylistsItemMoveByIdBody,
  ) {
    return this.request(
      `/api/v1/playlists/${playlistId}/items/move`,
      "POST",
      z.undefined(),
      body,
    );
  }

  getSystemInfo() {
    return this.request("/api/v1/system/info", "GET", api.GetSystemInfo);
  }

  setup(body: api.PostSystemSetupBody) {
    return this.request("/api/v1/system/setup", "POST", z.undefined(), body);
  }

  getLibrarySyncStatus() {
    return this.request("/api/v1/sync", "GET", api.GetSync);
  }

  librarySync() {
    return this.request("/api/v1/sync", "POST", z.undefined());
  }
}
