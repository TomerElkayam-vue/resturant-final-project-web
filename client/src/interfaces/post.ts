import { PostComment } from "./comment";
import { User } from "./user";

export interface Post {
  _id: string;
  owner: User;
  photoSrc: string;
  content: string;
  likedBy: User[];
  rating: number;
  comments: PostComment[];
}

export interface CreatePost {
  owner: string;
  content: string;
  rating: number;
  photo?: File | null;
}

export interface UpdatePost {
  content?: string;
  photo?: File | null;
  rating?: number;
  likedBy?: User[];
}
