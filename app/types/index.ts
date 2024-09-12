// app/types/index.ts

export interface Comment {
  _id: string;
  content: string;
  user: {
    _id: string;
    username: string;
    name: string;
  };
  createdAt: string;
  updatedAt?: string;
}

export interface Post {
  _id: string;
  content: string;
  user: {
    _id: string;
    username: string;
    name: string;
    profilePicture?: string;
  };
  createdAt: string;
  updatedAt?: string;
  likeCount: number;
  comments?: Comment[];
}

export interface User {
  _id: string;
  username: string;
  name: string;
  profilePicture?: string;
  bio?: string;
}