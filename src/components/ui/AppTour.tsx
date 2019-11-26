import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router-dom';
import Joyride, {
  CallBackProps,
  Step as TourStep,
  Props as JoyrideProps,
} from 'react-joyride';
import { useDispatch } from 'react-redux';
import { toggleAppTour } from '../../store/uiSlice';
import { useTypedSelector } from '../../store/index';

interface TourProps {
  step?: number;
}

const AppTour: React.FC<TourProps> = props => {
  const [t] = useTranslation();
  const history = useHistory();
  const dispatch = useDispatch();

  const [step, setStep] = useState(props.step);
  const { isAppTourActive } = useTypedSelector(state => state.ui);

  const steps: TourStep[] = [
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
      target: '.IntroHandle__choices',
      content:
        'Сообщите программе ваш прогресс и следуйте инструкциям',
    },
  ];

  function onStepChange({ index, action, lifecycle }: CallBackProps) {
    if (index === 2) {
      if (lifecycle === 'complete') {
        history.push('/');
        return dispatch(toggleAppTour());
      }
    }
    if (action === 'next' && lifecycle === 'complete')
      // @ts-ignore
      setStep(step + 1);
    if (index === 2) {
      return history.push('/tasks/introExample');
    }
  }

  const config: JoyrideProps = {
    steps,
    stepIndex: step,
    run: isAppTourActive,
    callback: onStepChange,
    continuous: true,
    scrollToFirstStep: true,
    showProgress: true,
    showSkipButton: false,
    hideBackButton: true,
    disableCloseOnEsc: true,
    disableOverlayClose: true,
    locale: {
      back: t('controls.back'),
      last: t('controls.close'),
      next: t('controls.next'),
      skip: t('controls.skip'),
      close: t('controls.close'),
    },
    debug: false,
  };
  return <Joyride {...config} />;
};

AppTour.defaultProps = {
  step: 0,
};

export default AppTour;
