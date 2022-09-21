import React from "react";
import { createContainer } from "./domManipulators";
import { CustomerForm } from "../src/CustomerForm";
import ReactTestUtils, { act } from "react-dom/test-utils";

describe("CustomerForm", () => {
  let render;
  let container;

  beforeEach(() => {
    ({ render, container } = createContainer());
  });

  const form = (id) => container.querySelector(`form[id="${id}"]`);
  const labelFor = (formElement) =>
    container.querySelector(`label[for="${formElement}"]`);

  const expectToBeInputFieldOfTypeText = (formElement) => {
    expect(formElement).toBeDefined();
    expect(formElement).not.toBeNull();
    expect(formElement.tagName).toEqual("INPUT");
    expect(formElement.type).toEqual("text");
  };

  const firstNameField = () => form("customer").elements.firstName;

  it("renders a form", () => {
    render(<CustomerForm />);
    expect(form("customer")).not.toBeNull();
  });

  it("renders the text name field as a text box", () => {
    render(<CustomerForm />);
    expectToBeInputFieldOfTypeText(firstNameField());
  });

  it("includes the existing value for the first name", () => {
    const firstName = "Ashley";

    render(<CustomerForm firstName={firstName} />);

    expect(firstNameField().value).toEqual(firstName);
  });

  it("renders a label for the first name field", () => {
    render(<CustomerForm />);

    expect(labelFor("firstName")).not.toBeNull();
    expect(labelFor("firstName").textContent).toEqual("First name");
  });

  it("assigns an id that matches the label id to the first name field", () => {
    render(<CustomerForm />);

    expect(firstNameField().id).toEqual("firstName");
  });

  it("saves the existing first name when submitted", async () => {
    expect.hasAssertions();

    render(
      <CustomerForm
        firstName="Ashley"
        onSubmit={({ firstName }) => expect(firstName).toEqual("Jamie")}
      />
    );

    act(() =>
      ReactTestUtils.Simulate.change(firstNameField(), {
        target: { value: "Jamie" },
      })
    );

    act(() => {
      ReactTestUtils.Simulate.submit(form("customer"));
    });
  });
});
