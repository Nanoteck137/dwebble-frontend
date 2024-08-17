import { env } from "$env/dynamic/private";
import { ApiClient } from "$lib/api/client";
import { error, redirect, type Handle } from "@sveltejs/kit";

const apiAddress = env.API_ADDRESS ? env.API_ADDRESS : "";

export const handle: Handle = async ({ event, resolve }) => {
  const url = new URL(event.request.url);

  let addr = apiAddress;
  if (addr == "") {
    addr = url.origin;
  }
  const client = new ApiClient(addr);

  const systemInfo = await client.getSystemInfo();
  if (!systemInfo.success) {
    throw error(systemInfo.error.code, { message: systemInfo.error.message });
  }

  console.log(systemInfo.data);

  if (!systemInfo.data.isSetup && url.pathname !== "/setup") {
    throw redirect(302, "/setup");
    // throw error(500, "Server not setup");
  }

  const auth = event.cookies.get("auth");
  if (auth && systemInfo.data.isSetup) {
    const obj = JSON.parse(auth);
    client.setToken(obj.token);

    const me = await client.getMe();
    if (!me.success) {
      throw error(me.error.code, { message: me.error.message });
    }

    event.locals.user = me.data;
  }

  event.locals.apiClient = client;

  if (url.pathname === "/login" && event.locals.user) {
    throw redirect(303, "/");
  }

  const response = await resolve(event);
  return response;
};
