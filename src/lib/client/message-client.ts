import { baseClient } from "#lib/client/base-client.js";

interface Conversation {
  in_read: number;
  unread_count: number;
}

interface ConversationResponse {
  response: {
    items: Conversation[];
  };
}

export class MessageClient {}
