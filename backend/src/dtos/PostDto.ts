export type PostDto = {
  id: number;
  type: string;
  content: string;
  user: {
    username: string;
    iconImage: string;
  },
  postedAt: Date;
  likeCount: number;
  isLiked: boolean;
}
