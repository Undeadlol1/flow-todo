import { addons } from '@storybook/addons';
import { create } from '@storybook/theming/create';

const theme = create({
  base: 'dark',
  brandTitle: 'Flow TODO components',
});

addons.setConfig({
  theme,
  panelPosition: 'bottom',
});