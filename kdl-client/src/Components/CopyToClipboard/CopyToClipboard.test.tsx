import CopyToClipboard from './CopyToClipboard';
import React from 'react';
import * as clipboard from 'Utils/clipboard';
import { shallow } from 'enzyme';

let component;
const foo = 'foo';

beforeEach(() => {
  component = shallow(<CopyToClipboard>{foo}</CopyToClipboard>);
});
describe('CopyToClipboard component', () => {
  test('Component match snapshot', () => {
    expect(component).toMatchSnapshot();
  });

  it('copy text on click', () => {
    // Arrange.
    const mockCopyAndToast = jest.fn();
    clipboard.copyAndToast = mockCopyAndToast;

    // Act.
    component.simulate('click');

    // Assert.
    expect(mockCopyAndToast).toHaveBeenCalledTimes(1);
    expect(mockCopyAndToast).toHaveBeenCalledWith(foo);
  });
});
