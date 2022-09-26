import React from "react";
import { createContainer } from "./domManipulators";
import { AppointmentForm } from "../src/AppointmentForm";
import ReactTestUtils, { act } from "react-dom/test-utils";

describe("AppointmentForm", () => {
  let render, container;

  const form = (id) => container.querySelector(`form[id="${id}"]`);
  const field = (name) => form("appointment").elements[name];
  const labelFor = (formElement) =>
    container.querySelector(`label[for="${formElement}"]`);
  const findOption = (dropdownNode, textContent) => {
    const options = Array.from(dropdownNode.childNodes);
    return options.find((option) => option.textContent == textContent);
  };
  const timeSlotTable = () => container.querySelector("table#time-slots");

  beforeEach(() => {
    ({ render, container } = createContainer());
  });

  describe("service field", () => {
    it("renders a select box", () => {
      render(<AppointmentForm />);
      expect(field("service")).not.toBeNull();
      expect(field("service").tagName).toEqual("SELECT");
    });

    it("renders a form", () => {
      render(<AppointmentForm />);
      expect(form("appointment")).not.toBeNull();
    });

    it("initially has a blank value chosen", () => {
      render(<AppointmentForm />);
      const firstNode = field("service").childNodes[0];
      expect(firstNode.value).toEqual("");
      expect(firstNode.selected).toBeTruthy();
    });

    it("lists all salon services", () => {
      const selectableServices = ["Cut", "Blow-dry"];

      render(<AppointmentForm selectableServices={selectableServices} />);
      const optionNodes = Array.from(field("service").childNodes);
      const renderedService = optionNodes.map((node) => node.textContent);

      expect(renderedService).toEqual(
        expect.arrayContaining(selectableServices)
      );
    });

    it("pre-selects the existing value", () => {
      const services = ["cut", "Blow-dry"];
      render(
        <AppointmentForm selectableServices={services} service="Blow-dry" />
      );

      const option = findOption(field("service"), "Blow-dry");

      expect(option.selected).toBeTruthy();
    });

    it("renders a label", () => {
      render(<AppointmentForm />);

      const label = labelFor("service");
      expect(label).not.toBeNull();
      expect(label.textContent).toEqual("Service");
    });

    it("assings an id that matches the label id", () => {
      render(<AppointmentForm />);

      expect(field("service").id).toEqual("service");
    });

    it("saves existing value when submitted", () => {
      expect.hasAssertions();

      render(
        <AppointmentForm
          service={"Cut"}
          onSubmit={({ service }) => expect(service).toEqual("Cut")}
        />
      );

      act(() => {
        ReactTestUtils.Simulate.submit(form("appointment"));
      });
    });

    it("saves new value when submitted", () => {
      expect.hasAssertions();

      const services = ["cut", "Blow-dry"];

      render(
        <AppointmentForm
          selectableServices={services}
          onSubmit={({ service }) => expect(service).toEqual("Blow-dry")}
        />
      );

      act(() => {
        ReactTestUtils.Simulate.change(field("service"), {
          target: { value: "Blow-dry", name: "service" },
        });
      });

      act(() => {
        ReactTestUtils.Simulate.submit(form("appointment"));
      });
    });
  });

  describe("time slot table", () => {
    it("renders a table for time slots", () => {
      render(<AppointmentForm />);

      expect(timeSlotTable).not.toBeNull();
    });

    it("renders a time slot for every half an hour between open and close times", () => {
      render(<AppointmentForm salonOpensAt={9} salonClosesAt={11} />);
      const timesOfDay = timeSlotTable().querySelectorAll("tbody >* th");
      expect(timesOfDay).toHaveLength(4);
      expect(timesOfDay[0].textContent).toEqual("09:00");
      expect(timesOfDay[1].textContent).toEqual("09:30");
      expect(timesOfDay[3].textContent).toEqual("10:30");
    });

    it("renders an empty cell at the start of the header row", () => {
      render(<AppointmentForm />);

      const headerRow = timeSlotTable().querySelector("thead > tr");

      expect(headerRow.firstChild.textContent).toEqual("");
    });

    it("renders a week of available dates", () => {
      const today = new Date(2022, 8, 24);

      render(<AppointmentForm today={today} />);

      const dates = timeSlotTable().querySelectorAll(
        "thead >* th:not(:first-child)"
      );

      expect(dates).toHaveLength(7);
      expect(dates[0].textContent).toEqual("Sat 24");
      expect(dates[1].textContent).toEqual("Sun 25");
      expect(dates[6].textContent).toEqual("Fri 30");
    });
  });
});
