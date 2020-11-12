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
  // TODO: remove?
  inputValue?: string;
}

export interface AutocompleteProps {
  label: string;
  onChange: (value: any) => void;
  options: OptionType[];
}

const filter = createFilterOptions<OptionType>();

const Autocomplete = memo(function Autocomplete(
  props: AutocompleteProps,
) {
  const classes = useStyles();

  // TODO: remove?
  const [value, setValue] = React.useState<OptionType | null>(null);

  return (
    <Box className={classes.root}>
      <MuiAutocomplete
        freeSolo
        clearOnBlur
        value={value}
        selectOnFocus
        handleHomeEndKeys
        options={props.options}
        renderOption={(i) => i.label}
        onChange={(event, newValue) => {
          console.log('on change newValue: ', newValue);
          props.onChange(newValue);
          // if (typeof newValue === 'string') {
          //   setValue({
          //     label: newValue,
          //   });
          // } else if (newValue && newValue.inputValue) {
          //   // Create a new value from the user input
          //   setValue({
          //     label: newValue.inputValue,
          //   });
          // } else {
          //   setValue(newValue);
          // }
        }}
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
      />
    </Box>
  );
});

Autocomplete.displayName = 'Autocomplete';

export { Autocomplete };
