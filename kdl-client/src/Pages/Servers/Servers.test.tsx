import React from 'react';
import Servers from './Servers';
import ServersSection from './components/ServersSection/ServersSection';
import { shallow } from 'enzyme';

jest.mock('Hooks/useServers', () =>
  jest.fn(() => ({
    servers: [{ type: 'local' }, { type: 'remote' }, { type: 'remote' }],
  }))
);
jest.mock('Hooks/useServers', () => ({
  __esModule: true,
  default: jest.fn(() => ({
    servers: [{ type: 'local' }, { type: 'remote' }, { type: 'remote' }],
  })),
  ServerType: { LOCAL: 'local', REMOTE: 'remote' },
}));

const component = shallow(<Servers serverSearch="someSearch" />);

describe('Servers component', () => {
  test('Component match snapshot', () => {
    expect(component).toMatchSnapshot();
  });

  it('show right amount of servers', () => {
    expect(component.find(ServersSection).first().props().servers.length).toBe(
      1
    );
    expect(component.find(ServersSection).last().props().servers.length).toBe(
      2
    );
  });
});
