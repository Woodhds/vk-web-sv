import { readonly, writable } from "svelte/store";
import type { VkMessage } from "../../models/types";
import { search as remoteSearch } from "../../routes/api/messages/search/search.remote";

const _messages = writable<VkMessage[]>([]);
const _isLoading = writable(false);
const _isGrab = writable(false);

export const messages = readonly<VkMessage[]>(_messages);
export const isLoading = readonly<boolean>(_isLoading);
export const isGrab = readonly<boolean>(_isGrab);

export const getMessages = async (search: string) => {
  _isLoading.set(true);
  try {
    const data = (await remoteSearch(search)) as { messages: VkMessage[] };

    _messages.set([...data.messages]);
  } finally {
    _isLoading.set(false);
  }
};

export const grab = async ({ submit }) => {
  _isGrab.set(true);
  try {
    await submit();
  } finally {
    _isGrab.set(false);
  }
};

export const repost = async (ownerId: number, id: number) => {
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

export const like = async (ownerId: number, id: number) => {
  _messages.update((d) => {
    const idx = d.findIndex((f) => f.ownerId === ownerId && f.id === id);

    if (idx >= 0) {
      d.splice(idx, 1, { ...d[idx], userLikes: true } as VkMessage);
    }

    return d;
  });
};
