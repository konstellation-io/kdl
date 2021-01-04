import CheckLocalServerRequirements, {
  CheckState,
} from './CheckLocalServerRequirements';

import { Button } from 'kwc';
import CheckLocalRequirements from './components/CheckLocalRequirements/CheckLocalRequirements';
import DefaultPage from 'Components/Layout/Page/DefaultPage/DefaultPage';
import React from 'react';
import { shallow } from 'enzyme';

const mockGoBack = jest.fn();
jest.mock('react-router-dom', () => ({
  useHistory: jest.fn(() => ({
    goBack: mockGoBack,
  })),
}));

const component = shallow(<CheckLocalServerRequirements />);

describe('CheckLocalServerRequirements page', () => {
  test('Component match snapshot', () => {
    expect(component).toMatchSnapshot();
  });

  it('show right texts', () => {
    expect(component.contains('Checking requirements')).toBeTruthy();
  });

  test('Install button is disabled when checks are not ok', () => {
    expect(
      component.find(DefaultPage).dive().find(Button).last().props().disabled
    ).toBeTruthy();
  });

  it('handles check updates', () => {
    component
      .find(CheckLocalRequirements)
      .props()
      .setChecksState(CheckState.OK);

    expect(
      component.find(DefaultPage).dive().find(Button).last().props().disabled
    ).toBeFalsy();
  });

  test('back action', () => {
    component.find(DefaultPage).dive().find(Button).first().simulate('click');

    expect(mockGoBack).toHaveBeenCalledTimes(1);
  });
});
