import { Button } from 'kwc';
import Navigation from './Navigation';
import React from 'react';
import Slide from './Slide';
import SlidePresentation from './SlidePresentation';
import { shallow } from 'enzyme';

const slides = [
  {
    img: 'image1',
    title: 'title1',
    description: 'description1',
  },
  {
    img: 'image2',
    title: 'title2',
    description: 'description2',
  },
];

describe('SlidePresentation component', () => {
  const component = shallow(<SlidePresentation slides={slides} />);

  test('Component match snapshot', () => {
    expect(component).toMatchSnapshot();
  });

  it('show first slide at the beginning', () => {
    expect(component.find(Slide).props().title).toBe('title1');
  });

  it('handles slide updates', () => {
    component.find(Navigation).props().nextStep();
    expect(component.find(Slide).props().title).toBe('title2');
  });
});

describe('Slide component', () => {
  const component = shallow(<Slide {...slides[0]} nextStep={jest.fn()} />);

  test('Component match snapshot', () => {
    expect(component).toMatchSnapshot();
  });

  it('show right texts', () => {
    expect(component.contains('title1')).toBeTruthy();
    expect(component.contains('description1')).toBeTruthy();
  });
});

describe('Navigation component', () => {
  const nextStepMock = jest.fn();
  const prevStepMock = jest.fn();
  const goToStepMock = jest.fn();

  const component = shallow(
    <Navigation
      actStep={0}
      nextStep={nextStepMock}
      totalSteps={2}
      goToStep={goToStepMock}
      prevStep={prevStepMock}
    />
  );

  test('Component match snapshot', () => {
    expect(component).toMatchSnapshot();
  });

  it('show right components', () => {
    expect(component.find('.navDotContainer').length).toBe(2);
  });

  it('moves to between steps', () => {
    component.find(Button).last().simulate('click');
    expect(nextStepMock).toHaveBeenCalledTimes(1);

    component.find(Button).first().simulate('click');
    expect(prevStepMock).toHaveBeenCalledTimes(1);

    component.find('.navDotContainer').last().simulate('click');
    component.find('.navDotContainer').first().simulate('click');
    expect(goToStepMock).toHaveBeenCalledTimes(2);
  });
});
