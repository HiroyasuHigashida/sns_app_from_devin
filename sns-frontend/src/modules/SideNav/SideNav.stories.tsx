import type { Meta, StoryObj } from "@storybook/react";
import { SideNav } from "./SideNav";
import { action } from "@storybook/addon-actions";

const meta = {
  title: "Modules/SideNav",
  component: SideNav,
  parameters: {
    layout: "padded",
  },
  tags: ["autodocs"],
} satisfies Meta<typeof SideNav>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Home: Story = {
  args: {
    activePage: "home",
    onNavigate: action("onNavigate"),
  },
};

export const Explore: Story = {
  args: {
    activePage: "explore",
    onNavigate: action("onNavigate"),
  },
};

export const Notifications: Story = {
  args: {
    activePage: "notifications",
    onNavigate: action("onNavigate"),
  },
};

export const Profile: Story = {
  args: {
    activePage: "profile",
    onNavigate: action("onNavigate"),
  },
};
