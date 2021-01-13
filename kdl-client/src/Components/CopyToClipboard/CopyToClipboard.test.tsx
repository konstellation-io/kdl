import CopyToClipboard from './CopyToClipboard';
import React from 'react';
import { copyToClipboard } from 'Utils/clipboard';
import { shallow } from 'enzyme';

jest.mock('Utils/clipboard');

const component = shallow(<CopyToClipboard>copyToClipboard</CopyToClipboard>);

describe('CopyToClipboard component', () => {
  test('Component match snapshot', () => {
    expect(component).toMatchSnapshot();
  });

  it('copy text on click', () => {
    component.simulate('click');

    expect(copyToClipboard).toHaveBeenCalledTimes(1);
    expect(copyToClipboard).toHaveBeenCalledWith('copyToClipboard');
  });
});
