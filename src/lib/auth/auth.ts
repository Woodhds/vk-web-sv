import { getRequestEvent } from "$app/server";

export const getAccessToken = () => {
  const { cookies } = getRequestEvent();
  const access_token = cookies.get("access_token");

  return access_token;
};
