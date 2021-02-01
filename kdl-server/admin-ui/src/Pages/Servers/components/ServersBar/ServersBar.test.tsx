import React from 'react';
import ServersBar from './ServersBar';
import { shallow } from 'enzyme';

const setValueMock = jest.fn();

const component = shallow(<ServersBar nServers={4} setValue={setValueMock} />);

describe('ServersBar component', () => {
  test('Component match snapshot', () => {
    expect(component).toMatchSnapshot();
  });

  it('show right texts', () => {
    expect(component.contains('4 servers shown')).toBeTruthy();
  });
});
