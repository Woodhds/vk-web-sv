import { json } from "@sveltejs/kit";
import { WallClient } from "$lib/client/wall-client";

export async function POST({ request }) {
  const reqData = (await request.json()) as {
    access_token: string;
    owner_id: number;
    post_id: number;
    comment: string;
  };
  const client = new WallClient();
  await client.createComment(
    reqData.owner_id,
    reqData.post_id,
    reqData.comment,
    reqData.access_token,
  );

  return json({});
}
