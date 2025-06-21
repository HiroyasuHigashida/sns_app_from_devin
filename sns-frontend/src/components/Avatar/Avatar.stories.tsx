import type { Meta, StoryObj } from "@storybook/react";
import { Avatar } from "./Avatar";

const meta = {
  title: "Components/Avatar",
  component: Avatar,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
} satisfies Meta<typeof Avatar>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Small: Story = {
  args: {
    size: "small",
    alt: "User",
    src: "https://mui.com/static/images/avatar/1.jpg",
  },
};

export const Medium: Story = {
  args: {
    size: "medium",
    alt: "User",
    src: "https://mui.com/static/images/avatar/2.jpg",
  },
};

export const Large: Story = {
  args: {
    size: "large",
    alt: "User",
    src: "https://mui.com/static/images/avatar/3.jpg",
  },
};

export const NoImage: Story = {
  args: {
    alt: "User",
  },
};
