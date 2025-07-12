import type { Meta, StoryObj } from "@storybook/vue3";
import PostForm from "./PostForm.vue";

const meta: Meta<typeof PostForm> = {
  title: "Components/PostForm",
  component: PostForm,
  parameters: {
    layout: "padded",
  },
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    onSubmit: (content: string) => console.log("onSubmit:", content),
  },
};
