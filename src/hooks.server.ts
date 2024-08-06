import { env } from "$env/dynamic/private";
import { ApiClient } from "$lib/api/client";
import { error, redirect, type Handle } from "@sveltejs/kit";

const apiAddress = env.API_ADDRESS ? env.API_ADDRESS : "";

export const handle: Handle = async ({ event, resolve }) => {
  let addr = apiAddress;
  if (addr == "") {
    addr = new URL(event.request.url).origin;
  }
  const client = new ApiClient(addr);

  const auth = event.cookies.get("auth");
  if (auth) {
    const obj = JSON.parse(auth);
    client.setToken(obj.token);

    const me = await client.getMe();
    if (me.status === "error") {
      throw error(500, "Failed to get auth user: " + me.error.message);
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
