import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router-dom';
import Joyride, { CallBackProps, Step } from 'react-joyride';

interface Props {
  step?: number;
}

const AppTour: React.FC<Props> = props => {
  const [t] = useTranslation();
  const history = useHistory();
  const [step, setStep] = useState(props.step);

  const steps: Step[] = [
    {
      target: '.IntroHandle__createTask',
      content: `Добавьте задачу в копилку`,
    },
    {
      target: '.IntroHandle__taskButton',
      content: 'Запустите алгоритм подбора задачи',
    },
    {
      target: '.IntroHandle__taskButton',
      content:
        'Сообщите программе ваш прогресс и следуйте инструкциям',
    },
  ];

  function tourOnChange({ index, action, lifecycle }: CallBackProps) {
    if (index === 2) {
      return history.push(
        lifecycle === 'complete' ? '/' : '/tasks/introExample',
      );
    }
    if (action === 'next' && lifecycle === 'complete')
      // @ts-ignore
      setStep(step + 1);
  }

  const joyrideProps = {
    steps,
    stepIndex: step,
    run: true,
    continuous: true,
    callback: tourOnChange,
    scrollToFirstStep: true,
    showProgress: true,
    showSkipButton: false,
    hideBadButton: false,
    locale: {
      back: t('controls.back'),
      last: t('controls.last'),
      next: t('controls.next'),
      skip: t('controls.skip'),
      close: t('controls.close'),
    },
    debug: process.env.NODE_ENV === 'development',
  };
  return <Joyride {...joyrideProps} />;
};

AppTour.defaultProps = {
  step: 0,
};

export default AppTour;
