import { json } from "@sveltejs/kit";

export const load = () => {
  return {
    CLIENT_ID: process.env.CLIENT_ID,
  };
}
