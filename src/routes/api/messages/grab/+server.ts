import {json} from "@sveltejs/kit";
import {WallClient} from "$lib/client/wall-client";
import {repository} from "$lib/database/messages";
import {repository as userRepository} from "$lib/database/users";
import type {MessageEntity} from "../../../../models/entities";

/** @type {import('./$types').RequestHandler} */
export async function POST({request}) {
    const wallClient = new WallClient();
    const users = await userRepository.getIds()

    for await (let user of users) {

        for (let i = 0; i < 4; i++) {

            const searchResponse = await wallClient.wallGet(user, 50, i * 50);

            if (searchResponse.error != null) {
                console.error(searchResponse.error);
                continue;
            }

            const ids = searchResponse.response.items
                .filter(e => e.copy_history?.length > 0)
                .map(e => e.copy_history[0])
                .map(e => ({owner_id: e.owner_id, id: e.id}))

            const data = await wallClient.getById(ids)

            if (data.response?.items.length > 0) {
                for (const item of data.response.items) {
                    await repository.insert({
                        owner_id: item.owner_id,
                        date: new Date().toISOString(),
                        id: item.id,
                        text: item.text,
                        reposted_from: user
                    } as MessageEntity)
                }
            }
        }
    }

    return json({})
}