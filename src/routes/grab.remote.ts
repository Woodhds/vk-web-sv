import { query } from "$app/server";
import { getAccessToken } from "$lib/auth/auth";
import { WallClient } from "$lib/client/wall-client";
import { repository } from "$lib/database/messages";
import { repository as userRepository } from "$lib/database/users";
import { error, json } from "@sveltejs/kit";
import { parse } from "node-html-parser";
import type { MessageEntity } from "../models/entities";

const wallClient = new WallClient();

export const grabData = query(async () => {
  const access_token = getAccessToken();

  if (!access_token) {
    return error(400);
  }

  for (let i = 1; i < 5; i++) {
    const data = new FormData();
    data.set("page_num", i.toString());
    data.set("city_id", "5");
    data.set("our", "");
    const resp = await fetch("https://wingri.ru/main/getPosts", {
      method: "POST",
      body: data,
    });

    const doc = parse(await resp.text());
    const el = doc.querySelectorAll(
      `.grid-item .post_container .post_footer a[href]`,
    );
    const ids = el
      .map((e) =>
        e.attributes.href
          .replace("https://vk.com/wall", "")
          .split("_")
          .filter((x) => x.length > 1),
      )
      .map((e) => ({
        owner_id: +e[0],
        id: +e[1],
      }));

    await insert(ids, null, access_token);
  }

  const users = await userRepository.getIds();

  for await (let user of users) {
    for (let i = 0; i < 4; i++) {
      const searchResponse = await wallClient.wallGet(
        user,
        50,
        i * 50,
        access_token,
      );

      if (searchResponse.error != null) {
        console.error(searchResponse.error);
        continue;
      }

      const ids = searchResponse.response.items
        .filter((e) => e.copy_history?.length > 0)
        .map((e) => e.copy_history[0])
        .map((e) => ({ owner_id: e.owner_id, id: e.id }));

      await insert(ids, user, access_token);
    }
  }

  return { success: true };

  async function insert(
    ids: { owner_id: number; id: number }[],
    user: number | null,
    accessToken: string,
  ) {
    const data = await wallClient.getById(ids, accessToken);

    if (data.response?.items.length > 0) {
      for (const item of data.response.items) {
        await repository.insert({
          owner_id: item.owner_id,
          date: new Date().toISOString(),
          id: item.id,
          text: item.text,
          reposted_from: user,
        } as MessageEntity);
      }
    }
  }
});
