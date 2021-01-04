import Server, { DIRECTION } from './Server';

import React from 'react';
import { shallow } from 'enzyme';

const component = shallow(<Server direction={DIRECTION.UP} />);

describe('Server component', () => {
  test('Component match snapshot', () => {
    expect(component).toMatchSnapshot();
  });

  it('show right components', () => {
    expect(component.find('.triangle').children().length).toBe(4);
  });
});
