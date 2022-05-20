import { shallow } from 'enzyme';
import React from 'react';
import WelcomeCard from '../../components/ui/WelcomeCard';
import { IndexPage, IndexPageProps } from './IndexPage';
import DailyStreak from '../../services/dailyStreak';
import CreateTaskFab from '../../components/tasks/CreateTaskFab';

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
      const fab = shallow(<IndexPage {...props} isLoading />).find(
        CreateTaskFab,
      );
      expect(fab.exists()).toBeFalsy();
    });

    test('is visible after loading', () => {
      const fab = shallow(
        <IndexPage {...props} isLoading={false} />,
      ).find(CreateTaskFab);
      expect(fab.prop('isHidden')).toBeFalsy();
    });
  });
});
