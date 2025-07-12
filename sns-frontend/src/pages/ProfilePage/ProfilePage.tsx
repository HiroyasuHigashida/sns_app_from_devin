import React from "react";
import { useParams } from '@tanstack/react-router';
import { Profile } from "@/modules/Profile";

export const ProfilePage: React.FC = () => {
  const { username } = useParams({ from: '/profile/$username' });
  return <Profile username={username} />;
};
