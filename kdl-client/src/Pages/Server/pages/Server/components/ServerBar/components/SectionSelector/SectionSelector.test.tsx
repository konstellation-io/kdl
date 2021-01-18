import SectionSelector from './SectionSelector';
import React from 'react';
import { shallow } from 'enzyme';
import { EnhancedRouteConfiguration } from '../../../../../../../../Hooks/useProjectNavigation';
import IconHome from '@material-ui/icons/Dashboard';

const section: EnhancedRouteConfiguration = {
  Icon: IconHome,
  label: 'foo',
  to: 'bar',
};

const props = {
  options: [section],
  selectedSection: 'baz',
};

let component;
beforeEach(() => {
  component = shallow(<SectionSelector {...props} />);
});

describe('SectionSelector component', () => {
  it('should render without crashing', function () {
    expect(component).toMatchSnapshot();
  });
});
