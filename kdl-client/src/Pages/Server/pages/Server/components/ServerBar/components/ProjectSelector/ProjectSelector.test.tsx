import ProjectSelector from './ProjectSelector';
import React from 'react';
import { shallow } from 'enzyme';
import { GetProjects_projects } from 'Graphql/queries/types/GetProjects';
import { ProjectState } from '../../../../../../../../Graphql/types/globalTypes';

const project: GetProjects_projects = {
  id: 'foo',
  name: 'bar',
  __typename: 'baz',
  creationDate: 'foofoo',
  description: 'foobar',
  error: 'foobaz',
  favorite: true,
  lastActivationDate: 'barfoo',
  repository: null,
  state: ProjectState.STARTED,
};
const projects: GetProjects_projects[] = [project];

const props = {
  options: projects,
  selectedProjectId: project.id,
  serverId: 'bar',
};

let component;
beforeEach(() => {
  component = shallow(<ProjectSelector {...props} />);
});

describe('ProjectSelector component', () => {
  it('should render without crashing', function () {
    expect(component).toMatchSnapshot();
  });
});
