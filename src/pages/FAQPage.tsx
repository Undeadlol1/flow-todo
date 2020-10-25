import React, { memo } from 'react';
import Box from '@material-ui/core/Box';
import Grid from '@material-ui/core/Grid';
import { Theme } from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';
import Accordion from '@material-ui/core/Accordion';
import Typography from '@material-ui/core/Typography';
import { useTypedTranslate } from '../services/index';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import AccordionDetails from '@material-ui/core/AccordionDetails';

const useStyles = makeStyles((theme: Theme) => ({
  pageContainer: {
    marginTop: 0,
    marginBottom: 0,
    minHeight: 'calc(100vh - 74px)',
  },
}));

const data = [
  [
    'Что это за приложение?',
    'Оно помогает выполнять дела, которые ты вечно откладываешь.',
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
        {data.map(([question, ...answerParagpraphs], index) => (
          <Accordion key={index}>
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls="panel1a-content"
              id="panel1a-header"
            >
              <Typography variant="subtitle1" component="h2">
                {question}
              </Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Box key={index}>
                {answerParagpraphs.map(answer => (
                  <Typography paragraph key={answer}>
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
