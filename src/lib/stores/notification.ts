import {readonly, writable} from "svelte/store";

export interface Notification {
  message: string;
  type: NotificationType;
}

export type NotificationType = 'success' | 'info' | 'warning' | 'error';

const _notifications = writable<Notification[]>([]);

export const notifications = readonly(_notifications);

export function add(message: string, type: NotificationType = 'info') {
  _notifications.update((f) => {
    f.push({ message, type });

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
