import { useQuery } from "@tanstack/react-query";
import { get } from "../../../api/methods";

interface PostResponse {
  id: number;
  type: string;
  content: string;
  user: {
    username: string;
    iconImage: string;
  };
  postedAt: string;
  likeCount: number;
  isLiked: boolean;
}

const formatTimestamp = (dateString: string): string => {
  const date = new Date(dateString);
  const now = new Date();
  const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
  
  if (diffInMinutes < 60) return `${diffInMinutes}m`;
  if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h`;
  return `${Math.floor(diffInMinutes / 1440)}d`;
};

export const useGetOwnerPosts = (owner: string, offset?: number, limit?: number) => {
  return useQuery({
    queryKey: ["ownerPosts", owner, offset, limit],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (offset !== undefined) params.append('offset', offset.toString());
      if (limit !== undefined) params.append('limit', limit.toString());
      const queryString = params.toString() ? `?${params.toString()}` : '';
      const rowPosts = (await get(`/api/posts/${owner}${queryString}`)) as {Items: PostResponse[]};

      const sortedPosts = rowPosts.Items.sort((a: PostResponse, b: PostResponse) => {
        return new Date(b.postedAt).getTime() - new Date(a.postedAt).getTime();
      });

      const posts = sortedPosts.map((post: PostResponse) => ({
        id: post.id,
        username: post.user.username,
        handle: post.user.username.toLowerCase(),
        avatar: post.user.iconImage || "",
        content: post.content,
        timestamp: formatTimestamp(post.postedAt),
        likes: post.likeCount,
        comments: 0,
        retweets: 0,
        isLiked: post.isLiked,
      }));

      return posts;
    },
    retry: 0,
  });
};
