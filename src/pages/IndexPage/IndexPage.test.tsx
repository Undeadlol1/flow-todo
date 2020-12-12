import { shallow } from 'enzyme';
import React from 'react';
import WelcomeCard from '../../components/ui/WelcomeCard';
import { IndexPage, IndexPageProps } from './IndexPage';
import DailyStreak from '../../services/dailyStreak';

const props = {
  logs: [],
  tasksToday: 3,
  tasksPerDay: 3,
  createdAtleastOneTask: false,
  streak: DailyStreak.getEmptyStreak(),
} as IndexPageProps;

describe('<HomePage />', () => {
  test('displays WelcomeCard by default', () => {
    const wrapper = shallow(<IndexPage {...props} />);
    const welcomeCard = wrapper.find(WelcomeCard);
    expect(welcomeCard.exists()).toBeTruthy();
  });

  describe('"add task" button', () => {
    test('is hidden during loading', () => {
      const wrapper = shallow(<IndexPage {...props} isLoading />);
      const Fab = wrapper.find('CreateTaskFab');
      expect(Fab.exists()).toBeFalsy();
    });

    test('is visible after loading', () => {
      const wrapper = shallow(
        <IndexPage {...props} isLoading={false} />,
      );
      const Fab = wrapper.find('CreateTaskFab');
      expect(Fab.prop('isHidden')).toBeFalsy();
    });
  });
});
