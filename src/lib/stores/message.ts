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

export const repost = async (ownerId: number, id: number, groups: number[]) => {
    await fetch(`api/messages`, {
        method: 'POST',
        body: JSON.stringify({ownerId, id, groups}),
    })

    _messages.update(d => {
        const idx = d.findIndex(f => id === f.id && ownerId === f.ownerId);

        if (idx >= 0) {
            d.splice(idx, 1, {...d[idx], userReposted: true, userLikes: true} as VkMessage);
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
        const idx = d.findIndex(f => f.ownerId === ownerId && f.id === id);

        if (idx >= 0) {
            d.splice(idx, 1, {...d[idx], userLikes: true} as VkMessage);
        }

        return d;
    })
}