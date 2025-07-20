import { error, json } from "@sveltejs/kit";
import { repository } from "$lib/database/users";
import { UserClient } from "$lib/client/user-client.js";

/** @type {import(./$types').RequestHandler} */
export async function DELETE({ params }) {
  await repository.delete(+params.id);
  return json({});
}

export async function POST({request}) {
  const data = (await request.json()) as {
    id: number,
    access_token: string
  }

  const client = new UserClient();

  const users = await client.getById(data.id, data.access_token);

  if (!users.response || users.response.length === 0) {
    return error(400, { message: 'not found' })
  }

  const user = users.response[0];

  await repository.add(user.id, user.last_name + ' ' + user.first_name, user.photo_50);

  return json({});
}