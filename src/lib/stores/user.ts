import { readonly, writable } from "svelte/store";

export interface UserState {
  avatar: string;
  name: string;
}

const _user = writable<UserState | null>();
export const user = readonly<UserState | null>(_user);

export function auth(user: UserState) {
  _user.set(user);
  localStorage.setItem("user", JSON.stringify(user));
}

export function logOut() {
  _user.set(null);
  localStorage.removeItem("user");
}

export function getUser() {
  _user.set(JSON.parse(localStorage.getItem("user")) as UserState);
}
