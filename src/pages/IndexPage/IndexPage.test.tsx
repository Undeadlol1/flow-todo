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
  test('displays WelcomeCard if user never created any tasks', () => {
    const wrapper = shallow(<IndexPage {...props} />);
    expect(wrapper.find(WelcomeCard)).toHaveLength(1);
  });

  describe('"add task" button', () => {
    test('is hidden during loading', () => {
      // const wrapper = shallow(<IndexPage isLoading />);
      // const Fab = wrapper.find('.IntroHandle__createTask');
      // expect(Fab.exists()).toBeTruthy();
    });

    test('is visible after loading', () => {
      const wrapper = shallow(
        <IndexPage {...props} isLoading={false} />,
      );
      const Fab = wrapper.find('.IntroHandle__createTask');
      expect(Fab.prop('isHidden')).toBeFalsy();
    });
  });
});
