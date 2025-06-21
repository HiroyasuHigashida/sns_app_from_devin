import { useMutation } from "@tanstack/react-query";
import { post, deleteRequest } from "@/api/methods";

interface LikeResponse {
  likeCount: number;
  isLiked: boolean;
}

export const useLike = (refetch: () => void) => {
  return useMutation({
    mutationFn: (postId: number) => post("/api/likes", { postid: postId }),
    onSuccess: () => {
      refetch();
    },
  });
};

export const useUnlike = (refetch: () => void) => {
  return useMutation({
    mutationFn: (postId: number) => deleteRequest(`/api/likes/${postId}`),
    onSuccess: () => {
      refetch();
    },
  });
};
