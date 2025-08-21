import { repository } from "$lib/database/messages";
import type { VkMessage } from "../../../../models/types";
import { WallClient, type WallGetResponse } from "$lib/client/wall-client";
import { getAccessToken } from "$lib/auth/auth";
import { query } from "$app/server";

export const search = query(
  "unchecked",
  async (search: string, isNew = false) => {
    const requestData = {
      search: search,
      isNew: isNew,
    };

    if (!requestData.search) {
      return { messages: [] };
    }

    const dbMessages = await repository.search({
      search: requestData.search,
    });

    if (!dbMessages.length) {
      return { messages: [] };
    }

    const wallClient = new WallClient();
    const resp: WallGetResponse[] = [];
    let page = 0;
    const pageSize = 200;
    const access_token = getAccessToken();

    while (page * pageSize < dbMessages.length) {
      const data = await wallClient.getById(
        dbMessages.slice(page * pageSize, pageSize * ++page).map((e) => ({
          id: e.id,
          owner_id: e.owner_id,
        })),
        access_token,
      );
      resp.push(data);
    }

    const messages: VkMessage[] = resp
      .flatMap((e) => e.response.items)
      .map((e) => {
        const dbMessage = dbMessages.find(
          (f) => f.owner_id == e.owner_id && f.id == e.id,
        );
        return {
          ownerId: e.owner_id,
          date: new Date(e.date * 1000).toISOString(),
          id: e.id,
          repostsCount: e.reposts?.count ?? 0,
          likesCount: e.likes?.count ?? 0,
          userLikes: e.likes?.user_likes ?? false,
          images: e.attachments
            ?.filter((e) => e.type === "photo")
            .map((e) => e.photo.sizes.find((e) => e.width > 200)?.url)
            .filter((e) => !!e),
          userReposted: e.reposts?.user_reposted ?? false,
          fromId: e.from_id,
          owner:
            resp
              .flatMap((e) => e.response.groups)
              .find((z) => z.id === -e.owner_id)?.name ??
            resp
              .flatMap((e) => e.response.profiles)
              .filter((z) => z.id === e.owner_id)
              ?.map((e) => `${e.first_name} ${e.last_name}`)[0] ??
            "",
          text: dbMessage?.text,
          parseDate: dbMessage?.date,
        } as VkMessage;
      });

    return { messages };
  },
);
