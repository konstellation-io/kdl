import Server, { DIRECTION } from '../Server/Server';

import React from 'react';
import ServerOption from './ServerOption';
import { shallow } from 'enzyme';

const component = shallow(
  <ServerOption
    title="Some title"
    subtitle="Some subtitle"
    actionLabel="Some label"
    to="/some/route"
    Server={<Server direction={DIRECTION.UP} />}
  />
);

describe('ServerOption component', () => {
  test('Component match snapshot', () => {
    expect(component).toMatchSnapshot();
  });

  it('show right texts', () => {
    expect(component.contains('Some title')).toBeTruthy();
    expect(component.contains('Some subtitle')).toBeTruthy();
  });

  it('show right components', () => {
    expect(component.find(Server).isEmptyRender()).toBeFalsy();
  });
});
