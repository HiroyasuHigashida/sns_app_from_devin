import { useMutation } from "@tanstack/react-query";
import { put, deleteRequest } from "../../../api/methods";



export const useUpdatePost = (refetch: () => void) => {
  return useMutation({
    mutationFn: ({ postId, content }: { postId: number; content: string }) => 
      put(`/api/posts/${postId}`, { content }),
    onSuccess: () => {
      refetch();
    },
  });
};

export const useDeletePost = (refetch: () => void) => {
  return useMutation({
    mutationFn: (postId: number) => deleteRequest(`/api/posts/${postId}`),
    onSuccess: () => {
      refetch();
    },
  });
};
