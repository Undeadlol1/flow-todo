import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router-dom';
import Joyride, { CallBackProps, Step, Props } from 'react-joyride';
import { useGlobal } from '../../store/ui';

interface TourProps {
  step?: number;
}

const AppTour: React.FC<TourProps> = props => {
  const [t] = useTranslation();
  const history = useHistory();
  const [step, setStep] = useState(props.step);
  const [store, actions] = useGlobal();

  const steps: Step[] = [
    {
      disableBeacon: true,
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
    if (index === 2 && lifecycle === 'complete') {
      actions.toggleAppTour();
      return history.push('/');
    }
    if (index === 2) {
      return history.push('/tasks/introExample');
    }
    if (action === 'next' && lifecycle === 'complete')
      // @ts-ignore
      setStep(step + 1);
  }

  const joyrideProps: Props = {
    steps,
    stepIndex: step,
    run: store.isAppTourActive,
    continuous: true,
    callback: tourOnChange,
    scrollToFirstStep: true,
    showProgress: true,
    showSkipButton: false,
    hideBackButton: false,
    disableCloseOnEsc: true,
    disableOverlayClose: true,

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
