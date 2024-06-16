import {readonly, writable} from "svelte/store";

const _notifications = writable<string[]>([]);

export const notifications = readonly(_notifications);

export function add(message: string) {
  _notifications.update((f) => {
    f.push(message);

    setTimeout(() => {
      if (f.length > 0) {
        _notifications.update((f) => {
          f.splice(0, 1);
          return f
        });
      }
    }, 3000);

    return f;
  });
}
