import { User } from "./types";

export const isOwner = (user: User, object: any) => {
  return object.owner === user.email;
};
