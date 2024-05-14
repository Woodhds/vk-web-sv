import {readonly, writable} from 'svelte/store'
import type {VkMessage} from "../../models/types";

const _messages = writable<VkMessage[]>([]);
const _isLoading = writable(false);
const _isGrab = writable(false);

export const messages = readonly<VkMessage[]>(_messages);
export const isLoading = readonly<boolean>(_isLoading);
export const isGrab = readonly<boolean>(_isGrab);

export const getMessages = async (search: string) => {
    _isLoading.set(true)
    try {
        const res = await fetch('api/messages/search', {
            method: 'POST',
            body: JSON.stringify({search}),
            headers: {
                'Content-Type': 'application/json'
            }
        });
        const data = await res.json() as { messages: VkMessage[] };

        _messages.set([...data.messages]);
    } finally {
        _isLoading.set(false)
    }
}

export const grab = async () => {
    _isGrab.set(true)
    try {
        await fetch("/api/messages/grab", {
            method: "POST"
        })
    } finally {
        _isGrab.set(false)
    }
}

export const repost = async (ownerId: number, id: number) => {
    await fetch(`api/messages`, {
        method: 'POST',
        body: JSON.stringify({ownerId, id}),
    })

    _messages.update(d => {
        const message = d.filter(f => id === f.id && ownerId === f.ownerId);
        const ids = message.map((a) => `${a.id}_${a.ownerId}`);
        for (let i = 0; i < d.length; i++) {
            for (let j = 0; j < ids.length; j++) {
                if (`${d[i].id}_${d[i].ownerId}` === ids[j]) {
                    d[i].userReposted = true;
                }
            }
        }

        return d;
    });
}

export const like = async (ownerId: number, id: number) => {
    await fetch(`api/messages`, {
        method: 'PUT',
        body: JSON.stringify({ownerId, id}),
    })

    _messages.update(d => {
        const message = d.find(f => f.ownerId === ownerId && f.id === id);

        if (message) {
            message.userLikes = true;
        }

        return d;
    })
}