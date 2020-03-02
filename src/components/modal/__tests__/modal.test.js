import React from "react";
import Modal from "../modal.js";

import Enzyme, { mount, shallow, render } from "enzyme";
import Adapter from "enzyme-adapter-react-16";
Enzyme.configure({ adapter: new Adapter() });

describe("<Modal /> component", () => {
  it("should render the header of the modal component", () => {
    const modal = shallow(<Modal />);
    expect(modal.find("header").exists()).toBeTruthy();
  });

  it("should render the span of the modal component", () => {
    const modal = shallow(<Modal />);
    expect(modal.find("span").exists()).toBeTruthy();
  });

  it("should render the button of the modal component", () => {
    const modal = shallow(<Modal />);
    expect(modal.find("button").exists()).toBeTruthy();
  });

});