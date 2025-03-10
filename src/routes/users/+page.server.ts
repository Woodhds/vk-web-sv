import { repository } from "$lib/database/users";
import type { UserEntity } from "../../models/entities";

export const load: () => Promise<{ users: Promise<UserEntity[]> }> = async () => {
  const data = repository.getAll();

  return { users: data };
};
