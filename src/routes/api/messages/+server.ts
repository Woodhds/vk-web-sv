import { error, json } from "@sveltejs/kit";
import { WallClient } from "$lib/client/wall-client";
import { GroupClient } from "$lib/client/group-client";

export async function POST({ request }) {
  const data = (await request.json()) as {
    ownerId: number;
    id: number;
    groups: number[];
    access_token: string;
  };

  if (!data) {
    return error(400, { message: "invalid request" });
  }

  const client = new WallClient();
  await client.repost(data.ownerId, data.id, data.access_token);

  const groupClient = new GroupClient();
  for (let i of data.groups) {
    await groupClient.join(i, data.access_token);
  }

  return json({});
}

export async function PUT({ request }) {
  const data = (await request.json()) as {
    ownerId: number;
    id: number;
    access_token: string;
  };

  if (!data) {
    return error(400, { message: "invalid request" });
  }

  const client = new WallClient();
  await client.like(data.ownerId, data.id, data.access_token);

  return json({});
}
