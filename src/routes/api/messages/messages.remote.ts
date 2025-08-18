import { error } from "@sveltejs/kit";
import { WallClient } from "$lib/client/wall-client";
import { GroupClient } from "$lib/client/group-client";
import { getAccessToken } from "$lib/auth/auth";
import { form } from "$app/server";

export const repost = form(async (data) => {
  const request = {
    ownerId: +data.get("ownerId"),
    id: +data.get("id"),
    groups: data.get("groups")?.toString().split(",").map(Number) || [],
  };

  const accessToken = getAccessToken();

  if (!data) {
    return error(400, { message: "invalid request" });
  }

  const client = new WallClient();
  await client.repost(request.ownerId, request.id, accessToken);

  const groupClient = new GroupClient();
  for (let i of request.groups) {
    await groupClient.join(i, accessToken);
  }

  return { success: true };
});

export const like = form(async (data) => {
  const request = {
    ownerId: +data.get("ownerId"),
    id: +data.get("id"),
  };

  if (!data) {
    return error(400, { message: "invalid request" });
  }

  const client = new WallClient();
  await client.like(request.ownerId, request.id, getAccessToken());

  return { success: true };
});

export const comment = form(async (data) => {
  const access_token = getAccessToken();
  const reqData = {
    owner_id: +data.get("ownerId"),
    post_id: +data.get("id"),
    comment: data.get("comment").toString(),
  };
  const client = new WallClient();
  await client.createComment(
    reqData.owner_id,
    reqData.post_id,
    reqData.comment,
    access_token,
  );

  return { success: true };
});
