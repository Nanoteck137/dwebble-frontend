import { z } from "zod";
import * as api from "~/lib/api/types";

function createApiResponse<
  Data extends z.ZodTypeAny,
  Errors extends z.ZodTypeAny,
>(data: Data, errors: Errors) {
  const error = z.object({
    code: z.number(),
    message: z.string(),
    errors,
  });

  return z.discriminatedUnion("status", [
    z.object({ status: z.literal("success"), data }),
    z.object({ status: z.literal("error"), error }),
  ]);
}

export class ApiClient {
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
}
