import type { PageLoad } from './$types';
import {repository} from "$lib/database/users";

export const load: PageLoad = async () => {
    const data = await repository.getAll()

    return { users: data }
}