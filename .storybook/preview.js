import { addDecorator } from '@storybook/react';
import { App } from '../src/App';

addDecorator(storyFn => <App>{storyFn()}</App>);