import {error, json,} from "@sveltejs/kit";
import type {VkAuthorizeResponse} from "../../../models/types";

/** @type {import('./$types').RequestHandler} */
export async function POST({request}) {
    const data = await request.json() as { code: string, redirectUrl: string };

    if (!data?.code) {
        return error(400);
    }

    const response = await fetch(`https://oauth.vk.com/access_token?client_id=${process.env.CLIENT_ID}&client_secret=${process.env.CLIENT_SECRET}&code=${data.code}&redirect_uri=${data.redirectUrl}&v=5.199`, {
        method: "POST"
    });

    const vkResponse = await response.json() as { access_token: string; expires_in: number, error: string };

    const expiresIn = new Date();
    if (vkResponse.access_token) {
        if (vkResponse.expires_in > 0) {
            expiresIn.setSeconds(expiresIn.getSeconds() + vkResponse.expires_in);
        } else {
            expiresIn.setMinutes(expiresIn.getMinutes() + 12000000);
        }
        return json({access_token: vkResponse.access_token, expires_in: expiresIn});
    }

    return error(400);
}