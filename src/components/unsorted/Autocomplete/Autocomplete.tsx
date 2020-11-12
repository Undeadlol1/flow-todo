import React, { memo } from 'react';
import { makeStyles } from '@material-ui/styles';
import { Box, TextField, Theme } from '@material-ui/core';
import MuiAutocomplete, {
  createFilterOptions,
} from '@material-ui/lab/Autocomplete';

const useStyles = makeStyles((theme: Theme) => ({ root: {} }));

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
  const classes = useStyles();

  return (
    <Box className={classes.root}>
      <MuiAutocomplete
        freeSolo
        clearOnBlur
        selectOnFocus
        handleHomeEndKeys
        options={props.options}
        renderOption={(i) => i.label}
        filterOptions={(options, params) => {
          console.log('params: ', params);
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
            props.onChange(newValue);
          } else {
            console.log('on change newValue: ', newValue);
            // TODO: rename this.
            if (newValue?.inputValue) {
              newValue.label = newValue.inputValue;
            }
            console.log('newValue.value: ', newValue?.value);
            props.onChange(newValue);
          }
        }}
      />
    </Box>
  );
});

Autocomplete.displayName = 'Autocomplete';

export { Autocomplete };
