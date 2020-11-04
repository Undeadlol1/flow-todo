import '@storybook/addon-console';
import { withKnobs } from '@storybook/addon-knobs';
import { addDecorator } from '@storybook/react';
import React from 'react';
import { App } from '../src/App';

addDecorator(withKnobs)
addDecorator(storyFn => (
    <App isStorybookEnv>
        {storyFn()}
    </App>
))

