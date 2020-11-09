import React, { memo } from 'react';
import { Box, Theme } from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';

const useStyles = makeStyles((theme: Theme) => ({ root: {} }));

interface Props {
};

const FocusModePage = memo((props: Props) => {
    const classes = useStyles();

    return (
        <Box className={classes.root}>
            Boilerplate is ready for you to work on.
        </Box>
    );
});

FocusModePage.displayName = 'FocusModePage';

export { FocusModePage }
