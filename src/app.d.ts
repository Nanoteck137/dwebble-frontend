// See https://kit.svelte.dev/docs/types#app

import type { ApiClient } from "$lib/api/client";

// for information about these interfaces
declare global {
  namespace App {
    // interface Error {}
    interface Locals {
      apiClient: ApiClient;
      user?: { id: string; username: string };
    }
    // interface PageData {}
    // interface PageState {}
    // interface Platform {}
  }
}

export {};
