import { form, query } from "$app/server";
import { repository } from "#lib/database/users.js";
import * as v from 'valibot';

export const loadUsers = query(async () => {
  return await repository.getAll();
});

export const deleteUser = form(v.object({id: v.number() }), async ({id}) => {
  await repository.delete(id);

  await loadUsers().refresh();
});
