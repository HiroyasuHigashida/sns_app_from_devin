import React from "react";
import { useNavigate } from '@tanstack/react-router';
import { Feed } from "@/modules/Feed";

export const TimelinePage: React.FC = () => {
  const navigate = useNavigate();
  
  const handleAvatarClick = (page: string, username?: string) => {
    if (page === "profile" && username) {
      navigate({ to: '/profile/$username', params: { username } });
    }
  };
  
  return <Feed onAvatarClick={handleAvatarClick} />;
};
