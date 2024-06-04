import {sql} from "@vercel/postgres"
import type {MessageEntity} from "../../models/entities";

class MessageRepository {
    async search(search: string) {
        const searchText = `'${search}'`

        const {rows} = await sql.query(`
            SELECT
                 messages.id,
                 date,
                 messages.owner_id,
                 ts_headline(messages.text, phraseto_tsquery($1), 'HighlightAll = true') as text
            FROM messages
            inner join messages_search s on messages.id = s.id AND messages.owner_id = s.owner_id
            where s.text @@ phraseto_tsquery($1)
            order by ts_rank(to_tsvector('russian', s.text), phraseto_tsquery($1)) desc;
        `, [searchText])

        return rows.map(e => ({id: e.id as number, owner_id: e.owner_id as number, text: e.text, date: e.date} as MessageEntity))
    }

    async insert(message: MessageEntity) {
        await sql`insert into messages (id, owner_id, date, text, reposted_from) VALUES (
            ${message.id}, ${message.owner_id}, now(), ${message.text}, ${message.reposted_from}) 
            ON CONFLICT (id, owner_id) DO NOTHING`
    }
}

const repository = new MessageRepository()

export {repository}