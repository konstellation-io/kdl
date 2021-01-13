import AddServer from '../Server/AddServer';
import { Button } from 'kwc';
import React from 'react';
import ServersSection from './ServersSection';
import { shallow } from 'enzyme';

const component = shallow(
  <ServersSection
    title="Some title"
    subtitle="Some subtitle"
    servers={[{ serverUrl: 'server.url', id: 'serverId' }]}
    ServerComponent={() => <div />}
    addServerRoute="/home"
  />
);

describe('ServersSection component', () => {
  test('Component match snapshot', () => {
    expect(component).toMatchSnapshot();
  });

  it('show right texts', () => {
    expect(component.contains('Some title')).toBeTruthy();
  });

  test('should hide add server button when not available', () => {
    expect(component.find(Button).isEmptyRender()).toBeFalsy();
    expect(component.find(AddServer).isEmptyRender()).toBeFalsy();

    component.setProps({ addServerRoute: '' });

    expect(component.find(Button).isEmptyRender()).toBeTruthy();
    expect(component.find(AddServer).isEmptyRender()).toBeTruthy();
  });
});
