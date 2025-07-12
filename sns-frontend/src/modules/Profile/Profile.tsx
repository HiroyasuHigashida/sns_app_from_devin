import React from "react";
import { Box, Typography } from "@mui/material";

interface ProfileProps {
  username?: string;
}

export const Profile: React.FC<ProfileProps> = ({ username }) => {
  return (
    <Box sx={{ p: 2 }}>
      <Typography variant="h4">Profile</Typography>
      {username && (
        <Typography variant="h6">User: {username}</Typography>
      )}
      <Typography variant="body1">
        Profile functionality will be implemented here.
      </Typography>
    </Box>
  );
};
