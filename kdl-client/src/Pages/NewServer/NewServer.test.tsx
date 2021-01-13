import ActionsBar from '../../Components/Layout/ActionsBar/ActionsBar';
import NewServer from './NewServer';
import React from 'react';
import ServerOption from './components/ServerOption/ServerOption';
import { shallow } from 'enzyme';
import useServers from 'Hooks/useServers';

jest.mock('Hooks/useServers');

let component;

describe('NewServer page without servers', () => {
  beforeEach(() => {
    useServers.mockImplementationOnce(() => ({
      servers: [],
    }));

    component = shallow(<NewServer />);
  });

  test('Component match snapshot', () => {
    expect(component).toMatchSnapshot();
  });

  it('show right texts', () => {
    expect(component.contains('Add a Server')).toBeTruthy();
  });

  it('has two options', () => {
    expect(component.find(ServerOption).length).toBe(2);
  });

  it('does not show actions when there are no servers', () => {
    expect(component.find(ActionsBar).isEmptyRender()).toBeTruthy();
  });
});

describe('NewServer page with servers', () => {
  beforeEach(() => {
    useServers.mockImplementationOnce(() => ({
      servers: [{ url: 'some.server' }],
    }));

    component = shallow(<NewServer />);
  });

  test('Component match snapshot', () => {
    expect(component).toMatchSnapshot();
  });

  it('shows actions when there are servers', () => {
    useServers.mockImplementation(() => ({
      servers: [{ url: 'some.server' }],
    }));

    component = shallow(<NewServer />);

    expect(component.find(ActionsBar).isEmptyRender()).toBeFalsy();
  });
});
