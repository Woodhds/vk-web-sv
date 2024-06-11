// @ts-ignore
import {env} from "$env/dynamic/private";

const baseUrl = "https://api.vk.com/method/";
const defaultTimeout = 500;

class BaseClient {
    async get<TResponse>(url: string, accessToken: string | null = null): Promise<TResponse> {
        let response = await fetch(this.createUrl(url, accessToken), {
            method: 'GET',
        })

        await this.delay()

        return await response.json() as TResponse
    }

    async post<TRequest, TResponse>(url: string, body: TRequest, accessToken: string | null = null): Promise<TResponse> {
        let response = await fetch(this.createUrl(url, accessToken), {
            method: 'POST',
            body: JSON.stringify(body),
            headers: {
                'Content-Type': 'application/json'
            }
        })

        await this.delay()

        return await response.json() as TResponse;
    }

    private createUrl(url: string, accessToken: string | null = null): string {
        const query = new URL(url, baseUrl);

        query.searchParams.set("access_token", accessToken ?? env.VK_TOKEN);
        query.searchParams.set("v", "5.199")

        return query.toString();
    }

    async delay() {
        await new Promise((resolve) => {
            setTimeout(resolve, defaultTimeout);
        })
    }
}

export const baseClient = new BaseClient();