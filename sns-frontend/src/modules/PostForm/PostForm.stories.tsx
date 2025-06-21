import type { Meta, StoryObj } from "@storybook/react";
import { PostForm } from "./PostForm";
import { action } from "@storybook/addon-actions";

const meta = {
  title: "Components/PostForm",
  component: PostForm,
  parameters: {
    layout: "padded",
  },
  tags: ["autodocs"],
} satisfies Meta<typeof PostForm>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    userAvatar: "https://mui.com/static/images/avatar/1.jpg",
    onSubmit: action("onSubmit"),
    maxLength: 140,
  },
};

export const ShorterLimit: Story = {
  args: {
    userAvatar: "https://mui.com/static/images/avatar/1.jpg",
    onSubmit: action("onSubmit"),
    maxLength: 50,
  },
};

export const NoAvatar: Story = {
  args: {
    onSubmit: action("onSubmit"),
    maxLength: 140,
  },
};
