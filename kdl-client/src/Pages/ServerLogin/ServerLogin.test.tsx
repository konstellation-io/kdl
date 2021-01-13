import { Button } from 'kwc';
import DefaultPage from 'Components/Layout/Page/DefaultPage/DefaultPage';
import React from 'react';
import ServerLogin from './ServerLogin';
import { ipcRenderer } from 'electron';
import { shallow } from 'enzyme';

jest.mock('Hooks/useServers', () =>
  jest.fn(() => ({
    getServer: jest.fn(() => ({ serverUrl: 'some.url' })),
  }))
);

jest.mock('electron', () => ({
  ipcRenderer: {
    send: jest.fn(),
  },
}));

jest.mock('react-router-dom', () => ({
  useParams: jest.fn(() => ({ serverId: 'serverId' })),
}));

// TODO: test useForm

const component = shallow(<ServerLogin />);

describe('ServerLogin', () => {
  test('Component match snapshot', () => {
    expect(component).toMatchSnapshot();
  });

  it('show right texts', () => {
    expect(component.contains('SERVER URL')).toBeTruthy();
  });

  test('action button', () => {
    component.find(DefaultPage).dive().find(Button).last().simulate('click');

    expect(ipcRenderer.send).toHaveBeenCalledTimes(1);
  });
});
