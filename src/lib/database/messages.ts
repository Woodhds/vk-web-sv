import { sql } from "@vercel/postgres";
import type { MessageEntity } from "../../models/entities";

class MessageRepository {
  async search(search: { search: string; }) {
    const searchText = `'${search.search}'`;

    const { rows } = await sql.query(
      `
            SELECT
                 messages.id,
                 date,
                 messages.owner_id,
                 ts_headline(messages.text, to_tsquery($1), 'HighlightAll = true') as text
            FROM messages
            inner join messages_search s on messages.id = s.id AND messages.owner_id = s.owner_id
            where s.text @@ to_tsquery($1)
            order by ts_rank(to_tsvector(s.text), to_tsquery($1)) desc;
        `,
      [searchText],
    );

    //  const {rows} = await sql.query(
    //   `
    //         SELECT
    //              id,
    //              date,
    //              owner_id,
    //             ts_headline(messages.text, to_tsquery($1), 'HighlightAll = true') as text
    //         FROM messages
    //         where created_at > now() - interval '6 hour'
    //         order by created_at
    //     `,
    //   [searchText],
    // );

    return rows.map(
      (e) =>
        ({
          id: e.id as number,
          owner_id: e.owner_id as number,
          text: e.text,
          date: e.date,
        }) as MessageEntity,
    );
  }

  async insert(message: MessageEntity) {
    await sql`insert into messages (id, owner_id, date, text, reposted_from) VALUES (
            ${message.id}, ${message.owner_id}, now(), ${message.text}, ${message.reposted_from}) 
            ON CONFLICT (id, owner_id) DO NOTHING`;
  }

  async migrate() {
    // await sql`
    //     CREATE TABLE IF NOT EXISTS messages
    //     (
    //         id           BigInt,
    //         date         Timestamp without time zone,
    //         owner_id      BigInt,
    //         reposted_from BigInt,
    //         Text         text,
    //         Primary Key (id, owner_id)
    //     );
    //     `
    // await sql`CREATE TABLE IF NOT EXISTS messages_search
    //     (
    //         id      BigInt,
    //         owner_id BigInt,
    //         text    text,
    //         FOREIGN KEY (id, owner_id) REFERENCES messages (id, owner_id)
    //     );
    //     `
    //
    // await sql`CREATE INDEX IF NOT EXISTS idx_gin_messages_search on messages_search using gin(to_tsvector('russian', Text));`

    await sql`
            CREATE OR REPLACE FUNCTION insert_to_search_table()
                RETURNS TRIGGER
                LANGUAGE PLPGSQL
            AS
            $$
                BEGIN
                INSERT INTO messages_search (id, owner_id, text) VALUES (new.id, new.owner_id, new.text);
                
                RETURN NEW;
                END;
            $$;
            `;
    //
    // await sql` DROP TRIGGER IF EXISTS TR_messages_AI on messages;`
    //
    // await sql`
    //     CREATE TRIGGER TR_messages_AI AFTER INSERT on messages
    //     FOR EACH ROW
    //     EXECUTE PROCEDURE insert_to_search_table();
    //
    //  `
  }
}

const repository = new MessageRepository();

export { repository };
