import { getRequestEvent } from "$app/server";

export const getAccessToken = () => {
  const { cookies } = getRequestEvent();

  return cookies.get("access_token");
};
