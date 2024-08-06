import { ApiClient } from "$lib/api/client";
import { error, redirect, type Handle } from "@sveltejs/kit";

export const handle: Handle = async ({ event, resolve }) => {
  const client = new ApiClient("http://10.28.28.6:3000");

  const auth = event.cookies.get("auth");
  if (auth) {
    const obj = JSON.parse(auth);
    client.setToken(obj.token);

    const me = await client.getMe();
    if (me.status === "error") {
      throw error(500, "Failed to get auth user");
    }

    event.locals.user = me.data;
  }

  event.locals.apiClient = client;

  const url = new URL(event.request.url);

  if (url.pathname === "/login" && event.locals.user) {
    throw redirect(303, "/");
  }

  const response = await resolve(event);
  return response;
};
