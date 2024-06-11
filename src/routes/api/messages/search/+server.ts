import {json} from "@sveltejs/kit";
import {repository} from "$lib/database/messages";
import type {VkMessage} from "../../../../models/types";
import {WallClient} from "$lib/client/wall-client";


/** @type {import('./$types').RequestHandler} */
export async function POST({request}) {
    const requestData: { search: string } = await request.json();

    if (!requestData.search) {
        return json({messages: []})
    }

    const dbMessages = await repository.search(requestData.search);

    if (!dbMessages.length) {
        return json({messages: []})
    }

    const wallClient = new WallClient();
    const data = await wallClient.getById(dbMessages.map(e => ({id: e.id, owner_id: e.owner_id})))

    const messages: VkMessage[] = data.response.items
        .map(e => {
            const dbMessage = dbMessages.find(f => f.owner_id == e.owner_id && f.id == e.id)
            return {
                ownerId: e.owner_id,
                date: new Date(e.date * 1000).toISOString(),
                id: e.id,
                repostsCount: e.reposts?.count ?? 0,
                likesCount: e.likes?.count ?? 0,
                userLikes: e.likes?.user_likes ?? false,
                images: e.attachments?.filter(e => e.type === 'photo')
                    .map(e => e.photo.sizes.find(e => e.width > 200)?.url)
                    .filter(e => !!e),
                userReposted: e.reposts?.user_reposted ?? false,
                fromId: e.from_id,
                owner: data.response.groups?.find(z => z.id === -e.owner_id)?.name
                    ?? data.response.profiles.filter(z => z.id === e.owner_id)?.map(e => `${e.first_name} ${e.last_name}`)[0] ??
                    "",
                text: dbMessage?.text,
                parseDate: dbMessage?.date
            } as VkMessage
        });

    return json({messages})
}