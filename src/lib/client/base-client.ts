// @ts-ignore
import {env} from "$env/dynamic/private";

const baseUrl = "https://api.vk.com/method/";

class BaseClient {
    timer = null;

    async get<TResponse>(url: string): Promise<TResponse> {
        let response = await fetch(this.createUrl(url), {
            method: 'GET',
        })

        await this.delay()

        return await response.json() as TResponse
    }

    async post<TRequest, TResponse>(url: string, body: TRequest): Promise<TResponse> {
        let response = await fetch(this.createUrl(url), {
            method: 'POST',
            body: JSON.stringify(body),
            headers: {
                'Content-Type': 'application/json'
            }
        })

        await this.delay()

        return await response.json() as TResponse;
    }

    private createUrl(url: string): string {
        const query = new URL(url, baseUrl);

        query.searchParams.set("access_token", env.VK_TOKEN);
        query.searchParams.set("v", "5.199")

        return query.toString();
    }

    async delay() {
        await new Promise((resolve) => {
            setTimeout(resolve, 500);
        })
    }
}

export const baseClient = new BaseClient();