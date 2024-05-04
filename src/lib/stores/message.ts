import {readonly, writable} from 'svelte/store'
import type {VkMessage} from "../../models/types";

const _messages = writable<VkMessage[]>([]);

export const messages = readonly<VkMessage[]>(_messages);

export const getMessages = async (search: string) => {
    const res = await fetch('api/messages',  {
        method: 'POST',
        body: JSON.stringify({search}),
        headers: {
            'Content-Type': 'application/json'
        }
    });
    const data = await res.json() as {messages: VkMessage[]};

    _messages.set([...data.messages]);
}