import type { Meta, StoryObj } from "@storybook/vue3";
import Button from "./Button.vue";

const meta: Meta<typeof Button> = {
  title: "Components/Button",
  component: Button,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {
  args: {
    variant: "primary",
    default: "Primary Button",
  },
};

export const Secondary: Story = {
  args: {
    variant: "secondary",
    default: "Secondary Button",
  },
};

export const Outlined: Story = {
  args: {
    variant: "outlined",
    default: "Outlined Button",
  },
};

export const Disabled: Story = {
  args: {
    variant: "primary",
    default: "Disabled Button",
  },
};
