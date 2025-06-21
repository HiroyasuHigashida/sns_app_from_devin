import type { Meta, StoryObj } from "@storybook/react";
import { Button } from "./Button";
import { FavoriteBorder, Share } from "@mui/icons-material";

const meta = {
  title: "Components/Button",
  component: Button,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {
  args: {
    variant: "primary",
    children: "ポスト",
  },
};

export const Secondary: Story = {
  args: {
    variant: "secondary",
    children: "フォロー",
  },
};

export const Outlined: Story = {
  args: {
    variant: "outlined",
    children: "キャンセル",
  },
};

export const Small: Story = {
  args: {
    size: "small",
    children: "小",
  },
};

export const Medium: Story = {
  args: {
    size: "medium",
    children: "中",
  },
};

export const Large: Story = {
  args: {
    size: "large",
    children: "大",
  },
};

export const FullWidth: Story = {
  args: {
    fullWidth: true,
    children: "全幅",
  },
};

export const WithStartIcon: Story = {
  args: {
    startIcon: <FavoriteBorder />,
    children: "いいね",
  },
};

export const WithEndIcon: Story = {
  args: {
    endIcon: <Share />,
    children: "共有",
  },
};
