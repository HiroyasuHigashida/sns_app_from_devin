import type { Meta, StoryObj } from "@storybook/react";
import { Feed } from "./Feed";

const meta = {
  title: "Modules/Feed",
  component: Feed,
  parameters: {
    layout: "padded",
  },
  tags: ["autodocs"],
} satisfies Meta<typeof Feed>;

export default meta;
type Story = StoryObj<typeof meta>;

const mockPosts = [
  {
    id: 1,
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
  {
    id: 2,
    username: "John Smith",
    handle: "johnsmith",
    avatar: "https://mui.com/static/images/avatar/1.jpg",
    content:
      "This is my first tweet on this platform. Excited to see how it works! #NewComer #Tech",
    timestamp: "3h",
    likes: 27,
    comments: 5,
    retweets: 8,
    isLiked: true,
  },
  {
    id: 3,
    username: "Alex Johnson",
    handle: "alexj",
    avatar: "https://mui.com/static/images/avatar/3.jpg",
    content:
      "Working on a new project using React and Material UI. Loving the developer experience so far! #React #MUI #WebDev",
    timestamp: "5h",
    likes: 42,
    comments: 7,
    retweets: 12,
    isLiked: false,
  },
];

export const Empty: Story = {
  args: {
    userAvatar: "https://mui.com/static/images/avatar/5.jpg",
    initialPosts: [],
  },
};

export const WithPosts: Story = {
  args: {
    userAvatar: "https://mui.com/static/images/avatar/5.jpg",
    initialPosts: mockPosts,
  },
};
