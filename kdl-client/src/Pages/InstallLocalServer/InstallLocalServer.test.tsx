import { mount, shallow } from 'enzyme';

import InstallLocalServer from './InstallLocalServer';
import React from 'react';
import StatusCircle from 'Components/LottieShapes/StatusCircle/StatusCircle';

jest.mock('electron', () => ({
  ipcRenderer: {
    send: jest.fn(),
    on: jest.fn(),
  },
}));

describe('InstallLocalServer page', () => {
  const component = shallow(<InstallLocalServer />);

  test('Component match snapshot', () => {
    expect(component).toMatchSnapshot();
  });

  it('show right texts', () => {
    expect(component.contains('INSTALLING LOG')).toBeTruthy();
  });

  it('hides slides when fullscreen', () => {
    expect(component.find('.box').props().height).toBe('auto');

    component.find('.expandButton').simulate('click');

    expect(component.find('.box').props().height).toBe(0);
  });
});

// TODO: study how to test IPC events
describe('Local serverinstalltion', () => {
  const component = mount(<InstallLocalServer />);

  it('show right texts', () => {
    expect(component.contains('INSTALLING LOG')).toBeTruthy();
  });

  it('start installation on mount', () => {
    expect(component.find(StatusCircle).isEmptyRender()).toBeFalsy();
  });
});
