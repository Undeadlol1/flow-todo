import React from 'react';
import renderer from 'react-test-renderer';
import { Provider } from 'react-redux';

import store from '../../store';
import HomePage from './HomePage';
import { BrowserRouter } from 'react-router-dom';
import WelcomeCard from './../../components/ui/WelcomeCard';
import { shallow } from 'enzyme';

describe('<HomePage />', () => {
  const defaultProps = {};
  const component = (
    <Provider store={store}>
      <BrowserRouter>
        <HomePage {...defaultProps} />
      </BrowserRouter>
    </Provider>
  );

  test('render', () => {
    const wrapper = renderer.create(component);
    expect(wrapper).toMatchSnapshot();
  });

  test('contains WelcomeCard', () => {
    const wrapper = shallow(component);
    console.log('debug', wrapper.debug());
  });
});
