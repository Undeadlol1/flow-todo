import { shallow } from 'enzyme';
import React from 'react';
import WelcomeCard from '../../components/ui/WelcomeCard';
import { IndexPage } from './IndexPage';

describe('<HomePage />', () => {
  test('displays WelcomeCard if user never created any tasks', () => {
    const wrapper = shallow(<IndexPage />);
    expect(wrapper.find(WelcomeCard)).toHaveLength(1);
  });

  describe('"add task" button', () => {
    test('is hidden during loading', () => {
      const wrapper = shallow(<IndexPage isLoading={true} />);
      const Fab = wrapper.find('.IntroHandle__createTask');
      // expect(Fab.exists()).toBeTruthy();
    });

    test('is visible after loading', () => {
      const wrapper = shallow(<IndexPage isLoading={false} />);
      const Fab = wrapper.find('.IntroHandle__createTask');
      expect(Fab.prop('isHidden')).toBeFalsy();
    });
  });
});
