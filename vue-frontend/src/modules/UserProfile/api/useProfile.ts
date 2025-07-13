import { useQuery, useMutation } from "@tanstack/vue-query";
import { get, put } from "@/api/methods";

interface ProfileResponse {
  profile: string;
}

export const useGetProfile = (username: string) => {
  return useQuery({
    queryKey: ["profile", username],
    queryFn: async () => {
      const response = await get(`/api/profiles/${username}`) as ProfileResponse;
      return response;
    },
    retry: 0,
  });
};

export const useUpdateProfile = (onSuccess?: () => void) => {
  return useMutation({
    mutationFn: (profile: string) => put("/api/profiles", { profile }),
    onSuccess: () => {
      if (onSuccess) onSuccess();
    },
    retry: 0,
  });
};

export const useGetIcon = (username: string) => {
  return useQuery({
    queryKey: ["icon", username],
    queryFn: async () => {
      const response = await get(`/api/icons/${username}`) as { iconImage: string };
      return response;
    },
    retry: 0,
  });
};

export const useUpdateIcon = (onSuccess?: () => void) => {
  return useMutation({
    mutationFn: (iconImage: string) => put("/api/icons", { iconImage }),
    onSuccess: () => {
      if (onSuccess) onSuccess();
    },
    retry: 0,
  });
};
