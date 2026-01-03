import { form, getRequestEvent, query, command } from "$app/server";
import { getAccessToken } from "$lib/auth/auth";
import { UserClient } from "$lib/client/user-client";
import { error } from "@sveltejs/kit";
import * as v from "valibot";

export const authorize = form(
  v.object({
    code: v.string(),
    redirectUri: v.string(),
  }),
  async ({ code, redirectUri }) => {
    const response = await fetch(
      `https://oauth.vk.com/access_token?client_id=${process.env.CLIENT_ID}&client_secret=${process.env.CLIENT_SECRET}&code=${code}&redirect_uri=${redirectUri}&v=5.199`,
      {
        method: "POST",
      },
    );

    const vkResponse = (await response.json()) as {
      access_token: string;
      expires_in: number;
      error: string;
      error_description: string;
      user_id: number;
    };

    if (vkResponse.error) {
      return error(400, vkResponse.error + ", " + vkResponse.error_description);
    }

    const expiresIn = new Date();
    if (vkResponse.access_token) {
      if (vkResponse.expires_in > 0) {
        expiresIn.setSeconds(expiresIn.getSeconds() + vkResponse.expires_in);
      } else {
        expiresIn.setMinutes(expiresIn.getMinutes() + 12000000);
      }

      const { cookies } = getRequestEvent();

      cookies.set("access_token", vkResponse.access_token, {
        path: "/",
      });
    }

    await getCurrentUser().refresh();

    return { success: true };
  },
);

export const getCurrentUser = query(async () => {
  const access_token = getAccessToken();

  if (!access_token) {
    return null;
  }

  const userClient = new UserClient();

  const {
    response: [vkUser],
  } = await userClient.getById(null, access_token);

  return vkUser;
});

export const logout = command(async () => {
  const { cookies } = getRequestEvent();

  cookies.delete("access_token", {
    path: "/",
  });

  getCurrentUser().refresh();

  return { success: true };
});
