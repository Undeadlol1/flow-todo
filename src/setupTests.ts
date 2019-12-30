import Enzyme from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import 'jest-enzyme';
import { initializeI18n } from './services/index';

Enzyme.configure({ adapter: new Adapter() });

beforeAll(() => {
  initializeI18n();
});
