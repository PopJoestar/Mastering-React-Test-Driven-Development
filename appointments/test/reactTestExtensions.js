import { createRoot } from "react-dom/client";
import { act } from "react-dom/test-utils";
import ReactTestUtils from "react-dom/test-utils";

export const createContainer = () => {
  const container = document.createElement("div");
  const root = createRoot(container);

  return {
    render: (component) => act(() => root.render(component)),
    container,
  };
};

export const click = (element) =>
  act(() => ReactTestUtils.Simulate.click(element));
