import React from "react";
import { createRoot } from "react-dom/client";
import { act } from "react-dom/test-utils";
import { Appointment } from "../src/Appointment";

describe("Appointment", () => {
  let container;
  let customer;
  let root;
  it("renders the customer first name", () => {
    customer = { firstName: "Ashley" };
    container = document.createElement("div");

    root = createRoot(container);

    act(() => root.render(<Appointment customer={customer} />));

    expect(container.textContent).toMatch("Ashley");
  });

  it("renders another customer first name", () => {
    customer = { firstName: "Jordan" };
    container = document.createElement("div");
    root = createRoot(container);

    act(() => root.render(<Appointment customer={customer} />));

    expect(container.textContent).toMatch("Jordan");
  });
});
