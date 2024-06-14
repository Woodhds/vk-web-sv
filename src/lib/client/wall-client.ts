import { baseClient } from "$lib/client/base-client";

interface Message {
  id: number;
  owner_id: number;
  date: number;
  text: string;
  from_id: number;
  reposts: { user_reposted: 1 | 0; count: number };
  likes: { user_likes: 1 | 0; count: number };
  copy_history: CopyHistory[];
  attachments: {
    type: string;
    photo: { sizes: { type: string; url: string; width: number }[] };
  }[];
}

interface Group {
  id: number;
  name: string;
  is_member: boolean;
}

interface Profile {
  id: number;
  first_name: string;
  last_name: string;
}

interface CopyHistory {
  id: number;
  owner_id: number;
}

interface WallGetResponse {
  response: {
    items: Message[];
    groups: Group[];
    profiles: Profile[];
  };
  error: { error_code: number; error_msg: string };
}

interface WallRepostResponse {}

export class WallClient {
  async getById(
    ids: { id: number; owner_id: number }[],
    accessToken: string,
  ): Promise<WallGetResponse> {
    const url = new URLSearchParams();
    url.set("posts", ids.map((e) => `${e.owner_id}_${e.id}`).join(","));
    url.set("extended", "1");
    url.set("fields", "is_member");

    return await baseClient.get<WallGetResponse>(
      "wall.getById?" + url.toString(),
      accessToken,
    );
  }

  async wallGet(owner_id: number, count = 50, offset = 0, accessToken: string) {
    const url = new URLSearchParams();
    url.set("owner_id", owner_id.toString());
    url.set("count", count.toString());
    url.set("filter", "owner");
    url.set("offset", offset.toString());

    return await baseClient.get<WallGetResponse>(
      "wall.get?" + url.toString(),
      accessToken,
    );
  }

  async repost(ownerId: number, id: number, accessToken: string | null = null) {
    const url = new URLSearchParams();
    url.set("object", `wall${ownerId}_${id}`);

    return await baseClient.post<void, WallRepostResponse>(
      "wall.repost?" + url.toString(),
      null,
      accessToken,
    );
  }

  async like(ownerId: number, id: number, accessToken: string) {
    const url = new URLSearchParams();
    url.set("owner_id", ownerId.toString());
    url.set("item_id", id.toString());
    url.set("type", "post");

    return await baseClient.get<void>(
      "likes.add?" + url.toString(),
      accessToken,
    );
  }
}
