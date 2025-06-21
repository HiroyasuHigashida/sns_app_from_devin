import type { Meta, StoryObj } from "@storybook/react";
import { NavLink } from "./NavLink";
import { Home, HomeOutlined, Person, PersonOutline } from "@mui/icons-material";

const meta = {
  title: "Components/NavLink",
  component: NavLink,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
} satisfies Meta<typeof NavLink>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    icon: <HomeOutlined fontSize="large" />,
    label: "Home",
    isActive: false,
  },
};

export const Active: Story = {
  args: {
    icon: <HomeOutlined fontSize="large" />,
    activeIcon: <Home fontSize="large" />,
    label: "Home",
    isActive: true,
  },
};

export const Profile: Story = {
  args: {
    icon: <PersonOutline fontSize="large" />,
    activeIcon: <Person fontSize="large" />,
    label: "Profile",
    isActive: false,
  },
};

export const ActiveProfile: Story = {
  args: {
    icon: <PersonOutline fontSize="large" />,
    activeIcon: <Person fontSize="large" />,
    label: "Profile",
    isActive: true,
  },
};
