import type { Meta, StoryObj } from "@storybook/react";
import CustomizedCard from "./Card";

const meta = {
  title: "Molecules/Card",
  component: CustomizedCard,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {},
} satisfies Meta<typeof CustomizedCard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {
  args: { loading: true },
};
