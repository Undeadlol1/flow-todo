import { shallow } from 'enzyme';
import React from 'react';
import RandomTaskButton from '../../components/tasks/RandomTaskButton/RandomTaskButton';
import { Task } from '../../store';
import WelcomeCard from './../../components/ui/WelcomeCard';
import { HomePage } from './HomePage';

describe('<HomePage />', () => {
  test('displays WelcomeCard if user never created any tasks', () => {
    const wrapper = shallow(<HomePage />);
    expect(wrapper.find(WelcomeCard)).toHaveLength(1);
  });

  test('displays RandomTaskButton if user created atleast one task', () => {
    const wrapper = shallow(
      <HomePage createdAtleastOneTask={[{} as Task]} />,
    );
    expect(wrapper.find(RandomTaskButton)).toHaveLength(1);
  });
});
