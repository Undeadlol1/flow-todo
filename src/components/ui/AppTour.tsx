import React from 'react';
import { useTranslation } from 'react-i18next';
import Joyride, {
  CallBackProps,
  STATUS,
  Step,
  StoreHelpers,
} from 'react-joyride';

interface Props {}

const AppTour: React.FC<Props> = () => {
  const [t] = useTranslation();
  const steps: any[] = [
    {
      target: '.IntroHandle__createTask',
      content: 'This is my awesome feature!',
    },
    {
      target: '.IntroHandle__taskButton',
      content: 'This another awesome feature!',
    },
  ];
  const joyrideProps = {
    callback: (argument: Object) =>
      console.log('joyride callback', argument),
    continuous: true,
    //   getHelpers: this.getHelpers,
    run: true,
    scrollToFirstStep: true,
    showProgress: true,
    showSkipButton: true,
    steps: steps,
    locale: {
      back: t('controls.back'),
      close: t('controls.close'),
      last: t('controls.last'),
      next: t('controls.next'),
      skip: t('controls.skip'),
    },
  };
  return <Joyride {...joyrideProps} />;
};

export default AppTour;
