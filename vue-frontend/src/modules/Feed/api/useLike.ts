import { useMutation } from "@tanstack/vue-query";
import { post, deleteRequest } from "@/api/methods";

export const useLike = (onSuccess?: () => void) => {
  return useMutation({
    mutationFn: (postId: number) => post("/api/likes", { postid: postId }),
    onSuccess: () => {
      if (onSuccess) onSuccess();
    },
    retry: 0,
  });
};

export const useUnlike = (onSuccess?: () => void) => {
  return useMutation({
    mutationFn: (postId: number) => deleteRequest(`/api/likes/${postId}`),
    onSuccess: () => {
      if (onSuccess) onSuccess();
    },
    retry: 0,
  });
};
