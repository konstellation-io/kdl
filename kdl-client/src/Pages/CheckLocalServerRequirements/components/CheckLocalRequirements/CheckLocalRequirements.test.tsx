import CheckLocalRequirements from './CheckLocalRequirements';
import React from 'react';
import { shallow } from 'enzyme';

const setChecksStateMock = jest.fn();

const component = shallow(
  <CheckLocalRequirements setChecksState={setChecksStateMock} />
);

describe('CheckLocalRequirements page', () => {
  test('Component match snapshot', () => {
    expect(component).toMatchSnapshot();
  });

  test('initially all checks are pending', () => {
    expect(component.find('.pending').length).toBe(3);
  });

  // TODO: study how to test ipcRender messages and useEffect tests
});
