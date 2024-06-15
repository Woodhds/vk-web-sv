import { error, json } from "@sveltejs/kit";
import { UserClient } from "$lib/client/user-client";

/** @type {import('./$types').RequestHandler} */
export async function POST({ request }) {
  const data = (await request.json()) as { code: string; redirectUrl: string };

  if (!data?.code) {
    return error(400);
  }

  const response = await fetch(
    `https://oauth.vk.com/access_token?client_id=${process.env.CLIENT_ID}&client_secret=${process.env.CLIENT_SECRET}&code=${data.code}&redirect_uri=${data.redirectUrl}&v=5.199`,
    {
      method: "POST",
    },
  );

  const vkResponse = (await response.json()) as {
    access_token: string;
    expires_in: number;
    error: string;
    user_id: number;
  };

  const expiresIn = new Date();
  if (vkResponse.access_token) {
    if (vkResponse.expires_in > 0) {
      expiresIn.setSeconds(expiresIn.getSeconds() + vkResponse.expires_in);
    } else {
      expiresIn.setMinutes(expiresIn.getMinutes() + 12000000);
    }

    const userClient = new UserClient();
    const {
      response: [vkUser],
    } = await userClient.getById(vkResponse.user_id, vkResponse.access_token);

    return json({
      access_token: vkResponse.access_token,
      expires_in: expiresIn,
      avatar: vkUser.photo_50,
      name: vkUser.first_name + " " + vkUser.last_name,
    });
  }

  return error(400);
}
