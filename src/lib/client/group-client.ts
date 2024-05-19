import {baseClient} from "$lib/client/base-client";

export class GroupClient {
    async join(id: number) {
        const url = new URLSearchParams()
        url.set("group_id", id.toString())

        return await baseClient.get<void>("groups.join?" + url.toString())
    }
}