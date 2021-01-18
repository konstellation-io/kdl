import Breadcrumbs from './Breadcrumbs';
import React from 'react';
import { shallow } from 'enzyme';

jest.mock('./useBreadcrumbs.tsx', () => () => ({
  crumbs: [
    {
      crumbText: 'foo',
      BottomComponent: <div>bar</div>,
      LeftIconComponent: <svg />,
    },
  ],
}));

let component;
beforeEach(() => {
  component = shallow(<Breadcrumbs />);
});

describe('Breadcrumbs component', () => {
  it('should render without crashing', function () {
    expect(component).toMatchSnapshot();
  });
});
