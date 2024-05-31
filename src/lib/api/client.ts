import { createSignal, Signal } from "solid-js";
import { z } from "zod";
import { createApiResponse } from "~/lib/models/api";
import {
  DeletePlaylistItemsByIdBody,
  GetAlbumById,
  GetAlbumTracksById,
  GetArtistAlbumsById,
  GetArtistById,
  GetArtists,
  GetAuthMe,
  GetPlaylistById,
  GetPlaylists,
  PostAuthSignin,
  PostAuthSigninBody,
  PostAuthSignup,
  PostAuthSignupBody,
  PostPlaylistItemsByIdBody,
  PostPlaylistsItemMoveByIdBody,
} from "~/lib/models/apiGen";

export type User = GetAuthMe;

export class Auth {
  apiClient: ApiClient;
  token?: string;
  userSignal: Signal<User | undefined>;

  constructor(apiClient: ApiClient) {
    this.apiClient = apiClient;
    this.userSignal = createSignal();

    const token = localStorage.getItem("user-token");
    if (token) {
      this.setToken(token);
    }
  }

  async resetToken() {
    this.token = undefined;
    this.userSignal[1](undefined);
    this.apiClient.setToken(undefined);

    localStorage.removeItem("user-token");
    // this.events.emit("onTokenChanged", this.token, this.user);
  }

  async setToken(newToken: string) {
    this.token = newToken;
    this.apiClient.setToken(this.token);

    const res = await this.apiClient.getMe();
    if (res.status === "error") {
      this.resetToken();
      return;
    }

    this.userSignal[1](res.data);
    localStorage.setItem("user-token", newToken);
  }

  user() {
    return this.userSignal[0];
  }
}

export default class ApiClient {
  baseUrl: string;
  token?: string;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  setToken(token?: string) {
    this.token = token;
  }

  async request<T extends z.ZodTypeAny>(
    endpoint: string,
    method: string,
    bodySchema: T,
    body?: any,
  ) {
    const headers: Record<string, string> = {};
    if (this.token) {
      headers["Authorization"] = `Bearer ${this.token}`;
    }

    if (body) {
      headers["Content-Type"] = "application/json";
    }

    const res = await fetch(this.baseUrl + endpoint, {
      method,
      headers,
      body: body ? JSON.stringify(body) : null,
    });

    const Schema = createApiResponse(bodySchema, z.undefined());

    const data = await res.json();
    const parsedData = await Schema.parseAsync(data);

    return parsedData;
  }

  login(body: PostAuthSigninBody) {
    return this.request("/api/v1/auth/signin", "POST", PostAuthSignin, body);
  }

  register(body: PostAuthSignupBody) {
    return this.request("/api/v1/auth/signup", "POST", PostAuthSignup, body);
  }

  getArtists() {
    return this.request("/api/v1/artists", "GET", GetArtists);
  }

  getArtistById(id: string) {
    return this.request(`/api/v1/artists/${id}`, "GET", GetArtistById);
  }

  getArtistAlbumsById(id: string) {
    return this.request(
      `/api/v1/artists/${id}/albums`,
      "GET",
      GetArtistAlbumsById,
    );
  }

  getAlbumById(id: string) {
    return this.request(`/api/v1/albums/${id}`, "GET", GetAlbumById);
  }

  getAlbumTracksById(id: string) {
    return this.request(
      `/api/v1/albums/${id}/tracks`,
      "GET",
      GetAlbumTracksById,
    );
  }

  createRandomQueue() {
    return this.request("/api/v1/queue", "POST", GetAlbumTracksById);
  }

  getMe() {
    return this.request("/api/v1/auth/me", "GET", GetAuthMe);
  }

  getPlaylists() {
    return this.request("/api/v1/playlists", "GET", GetPlaylists);
  }

  getPlaylistById(id: string) {
    return this.request(`/api/v1/playlists/${id}`, "GET", GetPlaylistById);
  }

  addItemsToPlaylists(playlistId: string, body: PostPlaylistItemsByIdBody) {
    return this.request(
      `/api/v1/playlists/${playlistId}/items`,
      "POST",
      z.undefined(),
      body,
    );
  }

  deleteItemsToPlaylists(
    playlistId: string,
    body: DeletePlaylistItemsByIdBody,
  ) {
    return this.request(
      `/api/v1/playlists/${playlistId}/items`,
      "POST",
      z.undefined(),
      body,
    );
  }

  movePlaylistItem(playlistId: string, body: PostPlaylistsItemMoveByIdBody) {
    return this.request(
      `/api/v1/playlists/${playlistId}/items/move`,
      "POST",
      z.undefined(),
      body,
    );
  }
}
