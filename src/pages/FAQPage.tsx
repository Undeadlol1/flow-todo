import React, { memo } from 'react';
import Box from '@material-ui/core/Box';
import Grid from '@material-ui/core/Grid';
import { Theme } from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';
import Accordion from '@material-ui/core/Accordion';
import Typography from '@material-ui/core/Typography';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import { useTypedTranslate } from '../services/index';
import { useTranslation } from 'react-i18next';

const useStyles = makeStyles((theme: Theme) => ({
  pageContainer: {
    marginTop: 0,
    marginBottom: 0,
    minHeight: 'calc(100vh - 74px)',
  },
}));

const FAQPage = memo(() => {
  const t = useTypedTranslate();
  const { t: faqStrings } = useTranslation('FAQ');
  const classes = useStyles();

  const data = [
    [
      faqStrings('What is this app for?'),
      faqStrings(
        'The app helps you do things that you always put off.',
      ),
    ],
    [
      'Какие задачи решает приложение?',
      'Задачи которые не особо важны и которые вечно откладываешь в долгий ящик.',
      'Тем не менее, которые неплохо было бы сделать.',
      'Например: выкинуть ненужные вещи, убраться на балконе.',
      'Важный момент: приложение НЕ предназначено для решения срочных или жизненно важных проблем.',
    ],
    [
      'Чем это приложение лучше других? Чем оно особенно?',
      'Эта программа использует различные психологические техники чтобы мотивировать вас, облегчить задачи и помочь сдвинуться с места.',
      'Она будет словно вести вас под руку при выполнении задач, по пути подсказывая решения типичных проблем.',
    ],
    [
      'Где все мои задачи?',
      'Приложение намеренно скрывает от вас список всех задач. Это часть дизайна.',
      'То есть, после того как вы добавили задачу в приложение, вы не должны о ней беспокоиться. Программа сама решит когда вы должны будете заняться ей. В этом ее предназначение. Она создана для того чтобы облегчать вам жизнь, чтобы помогать вам перестать беспокоиться о невыполненных делах.',
    ],
    [
      'Куда пропадают мои задачи?',
      'После того как вы поработали над задачей, она будет отложена. Программа использует увеличивающиеся интервальные повторения чтобы расчитать когда вам будет наиболее комфортно вернуться к задаче вновь.',
    ],
  ];

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
        {data.map(([question, ...answerParagpraphs], index) => (
          <Accordion key={index}>
            <AccordionSummary
              id="panel1a-header"
              expandIcon={<ExpandMoreIcon />}
              aria-controls="panel1a-content"
            >
              <Typography variant="subtitle1" component="h2">
                {question}
              </Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Box key={index}>
                {answerParagpraphs.map((answer) => (
                  <Typography key={answer} paragraph>
                    {answer}
                  </Typography>
                ))}
              </Box>
            </AccordionDetails>
          </Accordion>
        ))}
      </Grid>
    </Grid>
  );
});

export default FAQPage;
