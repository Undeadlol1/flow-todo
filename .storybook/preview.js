import { addDecorator } from '@storybook/react';
import { App } from '../src/App';
import { withKnobs } from '@storybook/addon-knobs';

addDecorator(storyFn => <withKnobs>{storyFn</withKnobs>)
addDecorator(storyFn => <App>{storyFn()}</App>);