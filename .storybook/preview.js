import '@storybook/addon-console';
import React from 'react'
import { addDecorator, configure } from '@storybook/react';
import { App } from '../src/App';
import { withKnobs } from '@storybook/addon-knobs';

addDecorator(withKnobs)
addDecorator(storyFn => (
    <App isStorybookEnv>
        {storyFn()}
    </App>
))

configure(require.context('../src', true, /\.stories\.(js|tsx)$/), module);
