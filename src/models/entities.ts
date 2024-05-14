export interface MessageEntity {
    id: number;
    owner_id: number;
    date: string
    text: string;
    reposted_from: number;
}

export interface UserEntity {
    id: number;
    name: string;
    avatar: string;
}