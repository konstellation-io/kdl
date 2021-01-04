import { Button } from 'kwc';
import ConnectToRemoteServer from './ConnectToRemoteServer';
import DefaultPage from 'Components/Layout/Page/DefaultPage/DefaultPage';
import React from 'react';
import SidebarBottom from 'Components/Layout/Page/DefaultPage/SidebarBottom';
import { ipcRenderer } from 'electron';
import { shallow } from 'enzyme';

const mockGoBack = jest.fn();
jest.mock('react-router-dom', () => ({
  useHistory: jest.fn(() => ({
    goBack: mockGoBack,
  })),
}));

jest.mock('electron', () => ({
  ipcRenderer: {
    send: jest.fn(),
  },
}));

// TODO: study how to test forms with useForm (act is causing infinite loops)

describe('ConnectToRemoteServer page', () => {
  let component: any;

  beforeEach(() => {
    component = shallow(<ConnectToRemoteServer />);
  });

  test('Component match snapshot', () => {
    expect(component).toMatchSnapshot();
  });

  it('show right texts', () => {
    expect(component.contains('How to connect to a Server')).toBeTruthy();
  });

  test('Initially is not connecting', () => {
    expect(component.find(SidebarBottom).isEmptyRender()).toBeTruthy();
  });

  test('back action', () => {
    component.find(DefaultPage).dive().find(Button).first().simulate('click');

    expect(mockGoBack).toHaveBeenCalledTimes(1);
  });

  test('action button', () => {
    component.find(DefaultPage).dive().find(Button).last().simulate('click');

    expect(ipcRenderer.send).toHaveBeenCalledTimes(1);

    // While checking, status circle is shown at sidebar bottom and buttons are hidden
    expect(component.find(SidebarBottom).isEmptyRender()).toBeFalsy();
    expect(
      component.find(DefaultPage).dive().find(Button).isEmptyRender()
    ).toBeTruthy();
  });
});
