import {baseClient} from "$lib/client/base-client";

export class UserClient {
    async getById(id: number) {
        const url = new URLSearchParams()
        url.set("user_ids", id.toString())

        return await baseClient.get<void>("users.get?" + url.toString())
    }
}