export interface VkMessage {
  id: number
  ownerId: number
  fromId: number
  likesCount: number
  repostsCount: number
  date: string
  owner: string
  text: string
  images: string[]
  userReposted: boolean
  userLikes: boolean
}

export interface GetMessagesResponse {
  messages: VkMessage[]
}

export interface VkUser {
  id: number
  name: string
  avatar: string
}

export interface VkUserListResponse {
  users: VkUser[]
}

export interface VkUserGroup {
  id: number;
  name: string;
  avatar: string;
}

export interface VkGroupGetResponse {
  groups: VkUserGroup[]
}
