import { useQuery, useMutation } from "@tanstack/react-query";
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
  });
};

export const useUpdateProfile = () => {
  return useMutation({
    mutationFn: (profile: string) => put("/api/profiles", { profile }),
  });
};

export const useGetIcon = (username: string) => {
  return useQuery({
    queryKey: ["icon", username],
    queryFn: async () => {
      const response = await get(`/api/icons/${username}`) as { iconImage: string };
      return response;
    },
  });
};

export const useUpdateIcon = () => {
  return useMutation({
    mutationFn: (iconImage: string) => put("/api/icons", { iconImage }),
  });
};
