import { config } from "../config";

const avatarUrlPrefix = config.avatarUrlPrefix;

export function getAvatarUrl(url: string) {
  return avatarUrlPrefix + url;
}
