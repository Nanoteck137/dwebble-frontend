import { ApiClient } from "$lib/api/client";
import type { Handle } from "@sveltejs/kit";

export const handle: Handle = async ({ event, resolve }) => {
  const client = new ApiClient("http://10.28.28.6:3000");

  const auth = event.cookies.get("auth");
  if (auth) {
    const obj = JSON.parse(auth);
    console.log(obj);
    client.setToken(obj.token);
    event.locals.user = obj.user;
  }

  event.locals.apiClient = client;

  const response = await resolve(event);
  return response;
};
