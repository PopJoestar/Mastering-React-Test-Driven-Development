import React from "react";
import { CustomerForm } from "../src/CustomerForm";
import ReactTestUtils, { act } from "react-dom/test-utils";
import {
  createContainer,
  element,
  form,
  field,
  labelFor,
} from "./reactTestExtensions";

const spy = () => {
  let receivedArguments;
  return {
    fn: (...args) => (receivedArguments = args),
    receivedArguments: () => receivedArguments,
    receivedArgument: (n) => receivedArguments[n],
  };
};

expect.extend({
  toHaveBeenCalledMine(received) {
    if (received.receivedArguments() === undefined) {
      return {
        pass: false,
        message: () => "Spy not called",
      };
    }

    return { pass: true, message: () => "Spy was called" };
  },
});

describe("CustomerForm", () => {
  let render;

  beforeEach(() => {
    ({ render } = createContainer());
  });

  const itRendersAsATextBox = (fieldName) =>
    it("renders as a text box", () => {
      render(<CustomerForm />);
      expect(field(fieldName)).toBeInputFieldOfType("text");
    });

  const itIncludesTheExistingValue = (fieldName) =>
    it("includes the existing value", () => {
      render(<CustomerForm {...{ [fieldName]: "value" }} />);
      expect(field(fieldName).value).toEqual("value");
    });

  const itRendersALabel = (fieldName, value) => {
    it("renders a label ", () => {
      render(<CustomerForm />);

      expect(labelFor(fieldName)).not.toBeNull();
      expect(labelFor(fieldName).textContent).toEqual(value);
    });
  };

  const itAssignsAnIdThatMatchesTheLabelId = (fieldName) => {
    it("assigns an id that matches the label id ", () => {
      render(<CustomerForm />);

      expect(field(fieldName).id).toEqual(fieldName);
    });
  };

  const itSubmitsExistingValue = (fieldName) => {
    it("saves the existing value when submitted", async () => {
      const submitSpy = spy();

      render(
        <CustomerForm {...{ [fieldName]: "value" }} onSubmit={submitSpy.fn} />
      );

      act(() => {
        ReactTestUtils.Simulate.submit(form("customer"));
      });
      // expect(submitSpy.receivedArguments()).toBeDefined();
      expect(submitSpy).toHaveBeenCalledMine();
      expect(submitSpy.receivedArgument(0)[fieldName]).toEqual("value");
    });
  };

  const itSubmitsNewValue = (fieldName, value) => {
    it("saves new value when submitted", async () => {
      expect.hasAssertions();

      render(
        <CustomerForm
          onSubmit={(props) => expect(props[fieldName]).toEqual(value)}
        />
      );

      act(() =>
        ReactTestUtils.Simulate.change(field(fieldName), {
          target: { value, name: fieldName },
        })
      );

      act(() => {
        ReactTestUtils.Simulate.submit(form("customer"));
      });
    });
  };

  it("renders a form", () => {
    render(<CustomerForm />);
    expect(form("customer")).not.toBeNull();
  });

  it("has a submit button", () => {
    render(<CustomerForm />);
    const submitButton = element('input[type="submit"]');
    expect(submitButton).not.toBeNull();
  });

  describe("first name field", () => {
    itRendersAsATextBox("firstName");
    itIncludesTheExistingValue("firstName");
    itRendersALabel("firstName", "First name");
    itAssignsAnIdThatMatchesTheLabelId("firstName");
    itSubmitsExistingValue("firstName", "Ashley");
    itSubmitsNewValue("firstName", "Jamie");
  });

  describe("last name field", () => {
    itRendersAsATextBox("lastName");
    itIncludesTheExistingValue("lastName");
    itRendersALabel("lastName", "Last name");
    itAssignsAnIdThatMatchesTheLabelId("lastName");
    itSubmitsExistingValue("lastName", "Jones");
    itSubmitsNewValue("lastName", "Ash");
  });

  describe("phone number field", () => {
    itRendersAsATextBox("phoneNumber");
    itIncludesTheExistingValue("phoneNumber");
    itRendersALabel("phoneNumber", "Phone number");
    itAssignsAnIdThatMatchesTheLabelId("phoneNumber");
    itSubmitsExistingValue("phoneNumber", "012345");
    itSubmitsNewValue("phoneNumber", "1234");
  });
});
