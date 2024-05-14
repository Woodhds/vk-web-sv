import {json} from "@sveltejs/kit";
import {repository} from "$lib/database/users";

/** @type {import(./$types').RequestHandler} */
export async function DELETE({params}) {

    await repository.delete(+params.id);
    return json({})
}