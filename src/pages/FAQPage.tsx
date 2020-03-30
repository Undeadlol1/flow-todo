import Grid from '@material-ui/core/Grid';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import React, { memo } from 'react';
import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import { useTypedTranslate } from '../services/index';
import Box from '@material-ui/core/Box';

const useStyles = makeStyles(theme => ({
  pageContainer: {
    marginTop: 0,
    marginBottom: 0,
    minHeight: 'calc(100vh - 74px)',
  },
}));

const data = [
  [
    'Что это за приложение?',
    'Оно помогает выполнять дела которые ты вечно откладываешь.',
  ],
  [
    'Какие задачи решает?',
    ` Задачи которые не особо важны и которые вечно откладываешь в долгий ящик.
    Тем не менее, которые неплохо было бы сделать.
    Например: выкинуть ненужные вещи, убраться на балконе.`,
  ],
  ['Куда пропадают мои задачи?', ''],
  ['Где все мои задачи?', ''],
  ['Что значит "аноним"?', ''],
];

const FAQPage = memo(function FAQPage() {
  const t = useTypedTranslate();
  const classes = useStyles();

  return (
    <Grid
      container
      spacing={2}
      justify="center"
      alignItems="stretch"
      alignContent="center"
      className={classes.pageContainer}
    >
      <Grid item xs={12} sm={6}>
        <Box mb={4} textAlign="center">
          <Typography variant="h1">
            {t('frequently asked questions')}
          </Typography>
        </Box>
        {/* TODO: i18n */}
        {data.map(i => (
          <ExpansionPanel>
            <ExpansionPanelSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls="panel1a-content"
              id="panel1a-header"
            >
              <Typography variant="subtitle1" component="h2">
                {i[0]}
              </Typography>
            </ExpansionPanelSummary>
            <ExpansionPanelDetails>
              <Typography paragraph>{i[1]}</Typography>
            </ExpansionPanelDetails>
          </ExpansionPanel>
        ))}
      </Grid>
    </Grid>
  );
});

export default FAQPage;
