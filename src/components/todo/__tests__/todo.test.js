import Enzyme, { shallow } from "enzyme";
import Adapter from "enzyme-adapter-react-16";
import React from 'react';
import renderer from "react-test-renderer";
import ToDo from '../todo.js';
Enzyme.configure({ adapter: new Adapter() });

xdescribe('<Todo />', () => {

    const todo = shallow(<ToDo />);

  it('starts up the application', () => {

    expect(todo.find('header').exists()).toBeTruthy();
    expect(todo.find('.todo').exists()).toBeTruthy();
  });

  it("should render the header of todo component", () => {

    expect(todo.find("header").exists()).toBeTruthy();
  });

  it("should render the header of todo component", () => {

    expect(todo.find("header").exists()).toBeTruthy();
  });

  it("should render the header of todo component", () => {

    expect(todo.find("header").exists()).toBeTruthy();
  });
});
