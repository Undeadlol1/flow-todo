import React from 'react';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';

interface Props {}

const RewardsPage: React.FC<Props> = () => {
  return (
    <Grid container>
      <Grid item xs>
        <Typography variant="h1" align="center">
          This is a test
        </Typography>
      </Grid>
    </Grid>
  );
};

export default RewardsPage;
