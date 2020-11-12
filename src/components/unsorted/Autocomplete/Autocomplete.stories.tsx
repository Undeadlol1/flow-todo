import React from 'react';
import { sections } from '../../storybookContants';
import { Autocomplete, AutocompleteProps } from './Autocomplete';

export default {
  component: Autocomplete,
  title: `${sections.unsorted}Autocomplete`,
};

const props: AutocompleteProps = {
  label: 'Movies',
  onChange: console.log,
  options: [
    { label: 'The Godfather', value: 1972 },
    { label: 'The Shawshank Redemption', value: 1994 },
  ],
};

export const Demo = (args) => <Autocomplete {...args} />;
Demo.args = props;
