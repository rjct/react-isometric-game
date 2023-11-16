import { VehicleComponent } from "@src/components/map/vehicles/Vehicle";
import { Vehicle } from "@src/engine/vehicle/VehicleFactory";
import type { Meta, StoryObj } from "@storybook/react";

const meta: Meta<typeof VehicleComponent> = {
  component: VehicleComponent,
};

export default meta;
type Story = StoryObj<typeof VehicleComponent>;

const vehicle = {
  className: "vehicle hummer",
  position: {
    screen: { x: 0, 0: 0 },
  },
  rotation: {
    deg: 90,
  },
  action: "collision",
} as unknown as Vehicle;

export const Hummer: Story = {
  render: () => <VehicleComponent vehicle={vehicle} />,
};
