import { form } from "$app/server";
import { getAccessToken } from "#lib/auth/auth.js";
import { UserClient } from "#lib/client/user-client.js";
import { repository } from "#lib/database/users.js";
import { error } from "@sveltejs/kit";
import * as v from "valibot";

export const addUser = form(v.object({ id: v.string() }), async ({ id }) => {
  const access_token = getAccessToken();

  const client = new UserClient();

  const users = await client.getById(+id, access_token);

  if (!users.response || users.response.length === 0) {
    return error(400, "not found");
  }

  const user = users.response[0];

  await repository.add(
    user.id,
    user.last_name + " " + user.first_name,
    user.photo_50,
  );

  return { success: true };
});
