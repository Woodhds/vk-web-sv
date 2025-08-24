import { error } from "@sveltejs/kit";
import { WallClient } from "$lib/client/wall-client";
import { GroupClient } from "$lib/client/group-client";
import { getAccessToken } from "$lib/auth/auth";
import { command } from "$app/server";

export const repost = command(
  "unchecked",
  async (request: { ownerId: number; id: number; groups: number[] }) => {
    const accessToken = getAccessToken();

    if (!request) {
      return error(400, { message: "invalid request" });
    }

    const client = new WallClient();
    await client.repost(request.ownerId, request.id, accessToken);

    const groupClient = new GroupClient();
    for (let i of request.groups) {
      await groupClient.join(i, accessToken);
    }

    return { success: true };
  },
);

export const like = command(
  "unchecked",
  async (request: { ownerId: number; id: number }) => {
    if (!request) {
      return error(400, { message: "invalid request" });
    }

    const client = new WallClient();
    await client.like(request.ownerId, request.id, getAccessToken());

    return { success: true };
  },
);

export const comment = command(
  "unchecked",
  async (request: { ownerId: number; comment: string; id: number }) => {
    const access_token = getAccessToken();

    const client = new WallClient();
    await client.createComment(
      request.ownerId,
      request.id,
      request.comment,
      access_token,
    );

    return { success: true };
  },
);
