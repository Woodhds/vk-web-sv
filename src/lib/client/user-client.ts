import { baseClient } from "$lib/client/base-client";

export interface VkUser {
  id: number;
  first_name: string;
  last_name: string;
  photo_50: string;
}

export class UserClient {
  async getById(id: number, accessToken: string) {
    const url = new URLSearchParams();
    url.set("user_ids", id.toString());
    url.set("fields", "photo_50");

    return await baseClient.get<{ response: VkUser[] }>(
      "users.get?" + url.toString(),
      accessToken,
    );
  }
}
