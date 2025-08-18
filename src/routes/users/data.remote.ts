import { form, query } from "$app/server";
import { repository } from "$lib/database/users";

export const loadUsers = query(async () => {
  const data = await repository.getAll();

  return data;
});

export const deleteUser = form(async (data) => {
  const id = data.get("id");

  await repository.delete(+id);

  await loadUsers().refresh();
});
