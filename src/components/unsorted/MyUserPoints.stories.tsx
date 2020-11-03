import React from 'react';
import { sections } from '../storybookContants';
import { MyUserPoints } from './MyUserPoints';

export default {
    component: MyUserPoints,
    title: sections.unsorted + 'MyUserPoints',
};

const props = {}

export const Demo = args => <MyUserPoints {...args} />
Demo.args = props
