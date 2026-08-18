import { sql } from "#lib/database/connection.ts";
import type { UserEntity } from "../../models/entities";

class UserRepository {
  async getIds(): Promise<number[]> {
    const data = await sql.query(`SELECT id FROM users`);

    return data.rows.map((row) => row.id);
  }

  async getAll(): Promise<UserEntity[]> {
    const data = await sql.query(`SELECT * FROM users`);

    return data.rows.map(
      (row) =>
        ({ id: row.id, avatar: row.avatar, name: row.name }) as UserEntity,
    );
  }

  async delete(id: number) {
    await sql.query(`DELETE FROM users WHERE id = ${id}`);
  }

  async add(id: number, name: string, avatar: string): Promise<void> {
    await sql.query(`insert into users (id, name, avatar) VALUES (${id}, ${name}, ${avatar})`);
  }
}

const repository = new UserRepository();

export { repository };
