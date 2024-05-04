import {json, type RequestHandler} from '@sveltejs/kit'
import type {VkMessage} from "../../../models/types";
// @ts-ignore
import {env} from '$env/dynamic/private'

interface Message {
    id: number,
    owner_id: number
    date: number
    text: string
    from_id: number
    reposts: { user_reposted: 1 | 0, count: number }
    likes: { user_likes: 1 | 0, count: number },
    attachments: { type: string, photo: { sizes: { type: string, url: string }[] } }[]
}

interface Group {
    id: number
    name: string;
    is_member: boolean;
}

/** @type {import('./$types').RequestHandler} */
export async function POST({request}) {
    const requestData: { search: string } = await request.json();

    if (!requestData.search) {
        return json({messages: []})
    }

    const res = await fetch(`https://api.vk.com/method/wall.get?v=5.199&access_token=${env.VK_TOKEN}&owner_id=${requestData.search}&extended=1`, {
        method: 'GET'
    })

    const data = await res.json() as { response: { items: Message[], groups: Group[] } }

    const messages: VkMessage[] = data.response.items.map(e => ({
        ownerId: e.owner_id,
        date: new Date(e.date * 1000).toISOString(),
        id: e.id,
        repostsCount: e.reposts?.count ?? 0,
        likesCount: e.likes?.count ?? 0,
        userLikes: e.likes?.user_likes ?? false,
        images: e.attachments.filter(e => e.type === 'photo' && e.photo?.sizes?.length > 2)
            .map(e => e.photo.sizes[3].url),
        userReposted: e.reposts?.user_reposted ?? false,
        fromId: e.from_id,
        owner: data.response.groups?.find(z => z.id === -e.owner_id)?.name ?? "",
        text: e.text
    } as VkMessage))

    return json({messages})
}