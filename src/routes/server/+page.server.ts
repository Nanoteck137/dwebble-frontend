import { error } from "@sveltejs/kit";
import type { Actions, PageServerLoad } from "./$types";

export const load: PageServerLoad = async () => {
  return {};
};

export const actions: Actions = {
  runSync: async ({ locals }) => {
    const res = await locals.apiClient.runSync();
    if (!res.success) {
      throw error(res.error.code, res.error.message);
    }
  },
};
