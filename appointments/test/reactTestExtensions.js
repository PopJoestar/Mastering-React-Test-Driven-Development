import { createRoot } from "react-dom/client";
import { act } from "react-dom/test-utils";
import ReactTestUtils from "react-dom/test-utils";

export const createContainer = () => {
  const container = document.createElement("div");
  const root = createRoot(container);
  document.body.replaceChildren(container);

  return {
    render: (component) => act(() => root.render(component)),
    container,
  };
};

export const click = (element) =>
  act(() => ReactTestUtils.Simulate.click(element));

export const element = (selector) => document.querySelector(selector);
export const elements = (selector) =>
  Array.from(document.querySelectorAll(selector));
export const typesOf = (elements) => elements.map((element) => element.type);
export const textOf = (elements) =>
  elements.map((element) => element.textContent);

export const form = (id) => element(`form[id="${id}"]`);
export const field = (name) => form("customer").elements[name];
export const labelFor = (formElement) => element(`label[for="${formElement}"]`);
