import { z } from "zod";
import * as api from "./types";
import BaseApiClient from "./base-client";

export class ApiClient extends BaseApiClient {
  constructor(baseUrl: string) {
    super(baseUrl);
  }
  
  getArtists() {
    return this.request("/api/v1/artists", "GET", api.GetArtists)
  }
  
  getArtistById(id: string) {
    return this.request(`/api/v1/artists/${id}`, "GET", api.GetArtistById)
  }
  
  getArtistAlbums(id: string) {
    return this.request(`/api/v1/artists/${id}/albums`, "GET", api.GetArtistAlbumsById)
  }
  
  getAlbums() {
    return this.request("/api/v1/albums", "GET", api.GetAlbums)
  }
  
  getAlbumById(id: string) {
    return this.request(`/api/v1/albums/${id}`, "GET", api.GetAlbumById)
  }
  
  getAlbumTracks(id: string) {
    return this.request(`/api/v1/albums/${id}/tracks`, "GET", api.GetAlbumTracksById)
  }
  
  getTracks() {
    return this.request("/api/v1/tracks", "GET", api.GetTracks)
  }
  
  getTrackById(id: string) {
    return this.request(`/api/v1/tracks/${id}`, "GET", api.GetTrackById)
  }
  
  getSyncStatus() {
    return this.request("/api/v1/sync", "GET", api.GetSync)
  }
  
  runSync() {
    return this.request("/api/v1/sync", "POST", z.undefined())
  }
  
  createQueue() {
    return this.request("/api/v1/queue", "POST", api.PostQueue)
  }
  
  getTags() {
    return this.request("/api/v1/tags", "GET", api.GetTags)
  }
  
  signup() {
    return this.request("/api/v1/auth/signup", "POST", api.PostAuthSignupBody)
  }
  
  signin() {
    return this.request("/api/v1/auth/signin", "POST", api.PostAuthSigninBody)
  }
  
  getMe() {
    return this.request("/api/v1/auth/me", "GET", api.GetAuthMe)
  }
  
  getPlaylists() {
    return this.request("/api/v1/playlists", "GET", api.GetPlaylists)
  }
  
  createPlaylist() {
    return this.request("/api/v1/playlists", "POST", api.PostPlaylistBody)
  }
  
  getPlaylistById(id: string) {
    return this.request(`/api/v1/playlists/${id}`, "GET", api.GetPlaylistById)
  }
  
  addItemsToPlaylist(id: string) {
    return this.request(`/api/v1/playlists/${id}/items`, "POST", api.PostPlaylistItemsByIdBody)
  }
  
  deletePlaylistItems(id: string) {
    return this.request(`/api/v1/playlists/${id}/items`, "DELETE", api.DeletePlaylistItemsByIdBody)
  }
  
  movePlaylistItem(id: string) {
    return this.request(`/api/v1/playlists/${id}/items/move`, "POST", api.PostPlaylistsItemMoveByIdBody)
  }
  
  getSystemInfo() {
    return this.request("/api/v1/system/info", "GET", api.GetSystemInfo)
  }
  
  runSystemSetup() {
    return this.request("/api/v1/system/setup", "POST", api.PostSystemSetupBody)
  }
  
  systemExport() {
    return this.request("/api/v1/system/export", "POST", api.PostSystemExport)
  }
  
  systemImport() {
    return this.request("/api/v1/system/import", "POST", z.undefined())
  }
}
