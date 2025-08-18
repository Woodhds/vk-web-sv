import { form, getRequestEvent } from "$app/server";
import { getAccessToken } from "$lib/auth/auth";
import { UserClient } from "$lib/client/user-client.js";
import { repository } from "$lib/database/users";
import { error } from "@sveltejs/kit";

export const addUser = form(async (data) => {
  const id = data.get("id");

  const access_token = getAccessToken();

  const client = new UserClient();

  const users = await client.getById(+id, access_token);

  if (!users.response || users.response.length === 0) {
    return error(400, { message: "not found" });
  }

  const user = users.response[0];

  await repository.add(
    user.id,
    user.last_name + " " + user.first_name,
    user.photo_50,
  );

  return { success: true };
});
