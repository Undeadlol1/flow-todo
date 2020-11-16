import { Box, TextField } from '@material-ui/core';
import MuiAutocomplete, {
  createFilterOptions,
} from '@material-ui/lab/Autocomplete';
import React, { memo } from 'react';

interface OptionType {
  value: any;
  label: string;
  inputValue?: string;
}

export interface AutocompleteProps {
  label: string;
  options: OptionType[];
  onChange: (value: any) => void;
}

const filter = createFilterOptions<OptionType>();

const Autocomplete = memo(function Autocomplete(
  props: AutocompleteProps,
) {
  return (
    <Box my={2}>
      <MuiAutocomplete
        freeSolo
        clearOnBlur
        selectOnFocus
        handleHomeEndKeys
        options={props.options}
        renderOption={(i) => i.label}
        filterOptions={(options, params) => {
          const filtered = filter(options, params);

          // Suggest the creation of a new value
          if (params.inputValue !== '') {
            filtered.push({
              // TODO this.
              value: {},
              inputValue: params.inputValue,
              // TODO: i18n
              label: `Add "${params.inputValue}"`,
            });
          }

          return filtered;
        }}
        getOptionLabel={(option) => {
          // Value selected with enter, right from the input
          if (typeof option === 'string') {
            return option;
          }
          // Add "xxx" option created dynamically
          if (option.inputValue) {
            return option.inputValue;
          }
          // Regular option
          return option.label;
        }}
        renderInput={(params) => (
          <TextField
            {...params}
            fullWidth
            variant="outlined"
            label={props.label}
          />
        )}
        onChange={(event, newValue, reason) => {
          if (reason !== 'select-option') {
            return;
          }

          if (typeof newValue === 'string') {
            return props.onChange(newValue);
          }

          // TODO: rename this.
          if (newValue?.inputValue) {
            newValue.label = newValue.inputValue;
          }

          props.onChange(newValue);
        }}
      />
    </Box>
  );
});

Autocomplete.displayName = 'Autocomplete';

export { Autocomplete };
