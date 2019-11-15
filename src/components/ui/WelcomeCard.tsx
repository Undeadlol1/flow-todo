import React from 'react';
import Paper from '@material-ui/core/Paper';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';

interface Props {}

const WelcomeCard: React.FC<Props> = () => {
  return (
    <Paper elevation={6}>
      <Typography paragraph>
        This is a test text
        <Button>want to take a ride?</Button>
      </Typography>
    </Paper>
  );
};

export default WelcomeCard;
