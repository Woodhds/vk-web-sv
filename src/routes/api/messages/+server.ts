import {error, json} from "@sveltejs/kit";
import {WallClient} from "$lib/client/wall-client";

export async function POST({request}) {

    const data = await request.json() as { ownerId: number, id: number };

    if (!data) {
        return error(400, {message: "invalid request"})
    }

    const client = new WallClient();
    await client.repost(data.ownerId, data.id)

    return json({})
}

export async function PUT({request}) {
    const data = await request.json() as { ownerId: number, id: number };

    if (!data) {
        return error(400, {message: "invalid request"})
    }

    const client = new WallClient();
    await client.like(data.ownerId, data.id);
}