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
    parseDate: string;
}

export interface VkAuthorizeResponse {
    access_token: string;
    error: string;
    expires_in: string;
}