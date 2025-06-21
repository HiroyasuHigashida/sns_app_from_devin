import type { Meta, StoryObj } from "@storybook/react";
import { PostCard } from "./PostCard";

const meta = {
  title: "Components/PostCard",
  component: PostCard,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
} satisfies Meta<typeof PostCard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    username: "Jane Doe",
    handle: "janedoe",
    avatar: "https://mui.com/static/images/avatar/2.jpg",
    content: "Just setting up my Twitter clone! #FirstTweet",
    timestamp: "2h",
    likes: 15,
    comments: 3,
    retweets: 5,
    isLiked: false,
  },
};

export const Liked: Story = {
  args: {
    username: "Jane Doe",
    handle: "janedoe",
    avatar: "https://mui.com/static/images/avatar/2.jpg",
    content: "Just setting up my Twitter clone! #FirstTweet",
    timestamp: "2h",
    likes: 16,
    comments: 3,
    retweets: 5,
    isLiked: true,
  },
};

export const LongContent: Story = {
  args: {
    username: "John Smith",
    handle: "johnsmith",
    avatar: "https://mui.com/static/images/avatar/1.jpg",
    content:
      "This is a longer tweet to demonstrate how a tweet with more content looks like in our Twitter clone. It should wrap properly and maintain readability. We want to make sure everything looks good even with longer text content. #Design #UI #UX #Frontend #React #MUI",
    timestamp: "5h",
    likes: 42,
    comments: 7,
    retweets: 12,
    isLiked: false,
  },
};
