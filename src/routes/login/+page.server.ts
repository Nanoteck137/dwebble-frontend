import { ApiClient } from "$lib/api/client";
import { error, redirect } from "@sveltejs/kit";
import type { Actions } from "./$types";

export const actions = {
  default: async ({ cookies, request }) => {
    const formData = await request.formData();
    console.log("Login");

    const username = formData.get("username")!;
    const password = formData.get("password")!;

    console.log(username, password);

    const client = new ApiClient("http://10.28.28.6:3000");
    const res = await client.signin({
      username: username.toString(),
      password: password.toString(),
    });

    if (res.status == "error") {
      throw error(res.error.code, { message: res.error.message });
    }

    client.setToken(res.data.token);
    const user = await client.getMe();
    if (user.status == "error") {
      throw error(user.error.code, { message: user.error.message });
    }

    const data = {
      token: res.data.token,
      user: {
        id: user.data.id,
        username: user.data.username,
      },
    };

    cookies.set("auth", JSON.stringify(data), {
      path: "/",
      secure: false,
      sameSite: "strict",
    });

    throw redirect(302, "/");
  },
} satisfies Actions;
