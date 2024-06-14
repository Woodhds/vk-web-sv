import { readonly, writable } from "svelte/store";
import type { VkMessage } from "../../models/types";

const _messages = writable<VkMessage[]>([]);
const _isLoading = writable(false);
const _isGrab = writable(false);

export const messages = readonly<VkMessage[]>(_messages);
export const isLoading = readonly<boolean>(_isLoading);
export const isGrab = readonly<boolean>(_isGrab);

export const getMessages = async (search: string, accessToken: string) => {
  _isLoading.set(true);
  try {
    const res = await fetch("api/messages/search", {
      method: "POST",
      body: JSON.stringify({ search, access_token: accessToken }),
      headers: {
        "Content-Type": "application/json",
      },
    });
    const data = (await res.json()) as { messages: VkMessage[] };

    _messages.set([...data.messages]);
  } finally {
    _isLoading.set(false);
  }
};

export const grab = async (accessToken: string) => {
  _isGrab.set(true);
  try {
    await fetch("/api/messages/grab", {
      method: "POST",
      body: JSON.stringify({ access_token: accessToken }),
    });
  } finally {
    _isGrab.set(false);
  }
};

export const repost = async (
  ownerId: number,
  id: number,
  groups: number[],
  accessToken: string | null = null,
) => {
  await fetch(`api/messages`, {
    method: "POST",
    body: JSON.stringify({ ownerId, id, groups, access_token: accessToken }),
  });

  _messages.update((d) => {
    const idx = d.findIndex((f) => id === f.id && ownerId === f.ownerId);

    if (idx >= 0) {
      d.splice(idx, 1, {
        ...d[idx],
        userReposted: true,
        userLikes: true,
      } as VkMessage);
    }

    return d;
  });
};

export const like = async (
  ownerId: number,
  id: number,
  accessToken: string,
) => {
  await fetch(`api/messages`, {
    method: "PUT",
    body: JSON.stringify({ ownerId, id, access_token: accessToken }),
  });

  _messages.update((d) => {
    const idx = d.findIndex((f) => f.ownerId === ownerId && f.id === id);

    if (idx >= 0) {
      d.splice(idx, 1, { ...d[idx], userLikes: true } as VkMessage);
    }

    return d;
  });
};
