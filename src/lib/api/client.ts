import { z } from "zod";
import * as api from "./types";
import { BaseApiClient, type ExtraOptions } from "./base-client";

export class ApiClient extends BaseApiClient {
  constructor(baseUrl: string) {
    super(baseUrl);
  }
  
  getArtists(options?: ExtraOptions) {
    return this.request("/api/v1/artists", "GET", api.GetArtists, undefined, options)
  }
  
  getArtistById(id: string, options?: ExtraOptions) {
    return this.request(`/api/v1/artists/${id}`, "GET", api.GetArtistById, undefined, options)
  }
  
  getArtistAlbums(id: string, options?: ExtraOptions) {
    return this.request(`/api/v1/artists/${id}/albums`, "GET", api.GetArtistAlbumsById, undefined, options)
  }
  
  getAlbums(options?: ExtraOptions) {
    return this.request("/api/v1/albums", "GET", api.GetAlbums, undefined, options)
  }
  
  getAlbumById(id: string, options?: ExtraOptions) {
    return this.request(`/api/v1/albums/${id}`, "GET", api.GetAlbumById, undefined, options)
  }
  
  getAlbumTracks(id: string, options?: ExtraOptions) {
    return this.request(`/api/v1/albums/${id}/tracks`, "GET", api.GetAlbumTracksById, undefined, options)
  }
  
  getTracks(options?: ExtraOptions) {
    return this.request("/api/v1/tracks", "GET", api.GetTracks, undefined, options)
  }
  
  getTrackById(id: string, options?: ExtraOptions) {
    return this.request(`/api/v1/tracks/${id}`, "GET", api.GetTrackById, undefined, options)
  }
  
  getSyncStatus(options?: ExtraOptions) {
    return this.request("/api/v1/sync", "GET", api.GetSync, undefined, options)
  }
  
  runSync(options?: ExtraOptions) {
    return this.request("/api/v1/sync", "POST", z.undefined(), undefined, options)
  }
  
  createQueue(options?: ExtraOptions) {
    return this.request("/api/v1/queue", "POST", api.PostQueue, undefined, options)
  }
  
  getTags(options?: ExtraOptions) {
    return this.request("/api/v1/tags", "GET", api.GetTags, undefined, options)
  }
  
  signup(body: api.PostAuthSignupBody, options?: ExtraOptions) {
    return this.request("/api/v1/auth/signup", "POST", api.PostAuthSignup, body, options)
  }
  
  signin(body: api.PostAuthSigninBody, options?: ExtraOptions) {
    return this.request("/api/v1/auth/signin", "POST", api.PostAuthSignin, body, options)
  }
  
  getMe(options?: ExtraOptions) {
    return this.request("/api/v1/auth/me", "GET", api.GetAuthMe, undefined, options)
  }
  
  getPlaylists(options?: ExtraOptions) {
    return this.request("/api/v1/playlists", "GET", api.GetPlaylists, undefined, options)
  }
  
  createPlaylist(body: api.PostPlaylistBody, options?: ExtraOptions) {
    return this.request("/api/v1/playlists", "POST", api.PostPlaylist, body, options)
  }
  
  getPlaylistById(id: string, options?: ExtraOptions) {
    return this.request(`/api/v1/playlists/${id}`, "GET", api.GetPlaylistById, undefined, options)
  }
  
  addItemsToPlaylist(id: string, body: api.PostPlaylistItemsByIdBody, options?: ExtraOptions) {
    return this.request(`/api/v1/playlists/${id}/items`, "POST", z.undefined(), body, options)
  }
  
  deletePlaylistItems(id: string, body: api.DeletePlaylistItemsByIdBody, options?: ExtraOptions) {
    return this.request(`/api/v1/playlists/${id}/items`, "DELETE", z.undefined(), body, options)
  }
  
  movePlaylistItem(id: string, body: api.PostPlaylistsItemMoveByIdBody, options?: ExtraOptions) {
    return this.request(`/api/v1/playlists/${id}/items/move`, "POST", z.undefined(), body, options)
  }
  
  getSystemInfo(options?: ExtraOptions) {
    return this.request("/api/v1/system/info", "GET", api.GetSystemInfo, undefined, options)
  }
  
  runSystemSetup(body: api.PostSystemSetupBody, options?: ExtraOptions) {
    return this.request("/api/v1/system/setup", "POST", z.undefined(), body, options)
  }
  
  systemExport(options?: ExtraOptions) {
    return this.request("/api/v1/system/export", "POST", api.PostSystemExport, undefined, options)
  }
  
  systemImport(options?: ExtraOptions) {
    return this.request("/api/v1/system/import", "POST", z.undefined(), undefined, options)
  }
}
