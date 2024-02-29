import { z } from "zod";
import {
  GetAlbumById,
  GetAlbumTracksById,
  GetArtistAlbumsById,
  GetArtistById,
  GetArtists,
} from "../models/api";

export default class ApiClient {
  baseUrl: string;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  async request<T extends z.ZodTypeAny>(
    endpoint: string,
    method: string,
    schema: T,
  ): Promise<z.infer<T>> {
    const res = await fetch(this.baseUrl + endpoint, {
      method,
    });

    const data = await res.json();
    return await schema.parseAsync(data);
  }

  async getArtists() {
    const res = await this.request("/api/v1/artists", "GET", GetArtists);
    if (res.status === "error") {
      throw new Error(res.error.message);
    }

    return res.data;
  }

  async getArtistById(id: string) {
    const res = await this.request(
      `/api/v1/artists/${id}`,
      "GET",
      GetArtistById,
    );
    if (res.status === "error") {
      console.log(res.error);
      throw new Error(res.error.message);
    }

    return res.data;
  }

  async getArtistAlbumsById(id: string) {
    const res = await this.request(
      `/api/v1/artists/${id}/albums`,
      "GET",
      GetArtistAlbumsById,
    );
    if (res.status === "error") {
      throw new Error(res.error.message);
    }

    return res.data;
  }

  async getAlbumById(id: string) {
    const res = await this.request(
      `/api/v1/albums/${id}`,
      "GET",
      GetAlbumById,
    );
    if (res.status === "error") {
      throw new Error(res.error.message);
    }

    return res.data;
  }

  async getAlbumTracksById(id: string) {
    const res = await this.request(
      `/api/v1/albums/${id}/tracks`,
      "GET",
      GetAlbumTracksById,
    );
    if (res.status === "error") {
      throw new Error(res.error.message);
    }

    return res.data;
  }
}
