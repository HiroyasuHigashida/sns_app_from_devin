import { useMutation } from "@tanstack/react-query";
import { post } from "@/api/methods";

interface PostData {
  content: string;
  user: string;
}

export const usePost = (refetch: () => void) => {
  return useMutation({
    mutationFn: (data: PostData) => post("/posts", data),
    onSuccess: () => {
      refetch();
    },
  });
};
