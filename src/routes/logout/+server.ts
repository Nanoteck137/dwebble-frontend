import { redirect } from "@sveltejs/kit";

export const POST = async ({ cookies, locals }) => {
  cookies.delete("auth", {
    path: "/",
    secure: false,
    sameSite: "strict",
  });
  locals.user = undefined;
  locals.apiClient.setToken(undefined);

  throw redirect(303, "/login");
};
