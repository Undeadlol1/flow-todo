import React, { memo } from 'react';
import { makeStyles } from '@material-ui/styles';
import { Box, TextField, Theme } from '@material-ui/core';
import { Autocomplete as MuiAutocomplete } from '@material-ui/lab';

const useStyles = makeStyles((theme: Theme) => ({ root: {} }));

export interface AutocompleteProps {
  label: string;
  onChange: (value: any) => void;
  options: { label: string; value: any }[];
}

const Autocomplete = memo(function Autocomplete(
  props: AutocompleteProps,
) {
  const classes = useStyles();

  return (
    <Box className={classes.root}>
      <MuiAutocomplete
        freeSolo
        options={props.options}
        getOptionLabel={(i) => i.label}
        renderInput={(params) => (
          <TextField
            {...params}
            fullWidth
            onChange={props.onChange}
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
