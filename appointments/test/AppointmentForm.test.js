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

  it("has a submit button", () => {
    render(<AppointmentForm />);
    expect(container.querySelector('input[type="submit"]')).not.toBeNull();
  });

  it("renders a form", () => {
    render(<AppointmentForm />);
    expect(form("appointment")).not.toBeNull();
  });

  const itRendersAsASelectBox = (fieldName) => {
    it("renders a select box", () => {
      render(<AppointmentForm />);
      expect(field(fieldName)).not.toBeNull();
      expect(field(fieldName).tagName).toEqual("SELECT");
    });
  };

  const itInitiallyHasABlankValueChosen = (fieldName) => {
    it("initially has a blank value chosen", () => {
      render(<AppointmentForm />);
      const firstNode = field(fieldName).childNodes[0];
      expect(firstNode.value).toEqual("");
      expect(firstNode.selected).toBeTruthy();
    });
  };

  const itListsAllAvailableOptions = (fieldName, options) => {
    it("lists all available options", () => {
      render(<AppointmentForm {...options} />);
      const optionNodes = Array.from(field(fieldName).childNodes);
      const renderedOptions = optionNodes.map((node) => node.textContent);

      expect(renderedOptions).toEqual(
        expect.arrayContaining(Object.values(options)[0])
      );
    });
  };

  const itPreSelectTheExistingValue = (fieldName, options, value) => {
    it("pre-selects the existing value", () => {
      render(<AppointmentForm {...options} {...{ [fieldName]: value }} />);

      const option = findOption(field(fieldName), value);

      expect(option.selected).toBeTruthy();
    });
  };

  const itRendersALabel = (fieldName, value) => {
    it("renders a label", () => {
      render(<AppointmentForm />);

      const label = labelFor(fieldName);
      expect(label).not.toBeNull();
      expect(label.textContent).toEqual(value);
    });
  };

  const itAssignsAnIdThatMatchesTheLabelId = (fieldName) => {
    it("assigns an id that matches the label id", () => {
      render(<AppointmentForm />);

      expect(field(fieldName).id).toEqual(fieldName);
    });
  };

  const itSavesExistingValueWhenSubmitted = (fieldName, value) => {
    it("saves existing value when submitted", () => {
      expect.hasAssertions();

      render(
        <AppointmentForm
          {...{ [fieldName]: value }}
          onSubmit={(props) => expect(props[fieldName]).toEqual(value)}
        />
      );

      act(() => {
        ReactTestUtils.Simulate.submit(form("appointment"));
      });
    });
  };

  const itSavesNewValueWhenSubmitted = (fieldName, options, value) => {
    it("saves new value when submitted", () => {
      expect.hasAssertions();

      render(
        <AppointmentForm
          {...options}
          onSubmit={(props) => expect(props[fieldName]).toEqual(value)}
        />
      );

      act(() => {
        ReactTestUtils.Simulate.change(field(fieldName), {
          target: { value, name: fieldName },
        });
      });

      act(() => {
        ReactTestUtils.Simulate.submit(form("appointment"));
      });
    });
  };

  describe("service field", () => {
    itRendersAsASelectBox("service");
    itInitiallyHasABlankValueChosen("service");
    itListsAllAvailableOptions("service", {
      selectableServices: ["Cut", "Blow-dry"],
    });
    itPreSelectTheExistingValue(
      "service",
      { selectableServices: ["Cut", "Blow-dry"] },
      "Blow-dry"
    );
    itRendersALabel("service", "Service");
    itAssignsAnIdThatMatchesTheLabelId("service");
    itSavesExistingValueWhenSubmitted("service", "Cut");
    itSavesNewValueWhenSubmitted(
      "service",
      { selectableServices: ["Cut", "Blow-dry"] },
      "Blow-dry"
    );
  });

  describe("stylist field", () => {
    itRendersAsASelectBox("stylist");
    itInitiallyHasABlankValueChosen("stylist");
    itListsAllAvailableOptions("stylist", { selectableStylists: ["A", "B"] });
    itPreSelectTheExistingValue(
      "stylist",
      { selectableStylists: ["A", "B"] },
      "B"
    );
    itRendersALabel("stylist", "Stylist");
    itAssignsAnIdThatMatchesTheLabelId("stylist");
    itSavesExistingValueWhenSubmitted("stylist", "A");
  });

  describe("time slot table", () => {
    const startsAtField = (index) =>
      container.querySelectorAll(`input[name="startsAt"]`)[index];

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

    it("renders a radio button for each time slot", () => {
      const today = new Date();
      const availableTimeSlots = [
        { startsAt: today.setHours(9, 0, 0, 0) },
        { startsAt: today.setHours(9, 30, 0, 0) },
      ];

      render(
        <AppointmentForm
          availableTimeSlots={availableTimeSlots}
          today={today}
        />
      );

      const cells = timeSlotTable().querySelectorAll("td");
      expect(cells[0].querySelector('input[type="radio"]')).not.toBeNull();
      expect(cells[7].querySelector('input[type="radio"]')).not.toBeNull();
    });

    it("does not render radio button for unavailable time slots", () => {
      render(<AppointmentForm availableTimeSlots={[]} />);
      const timesOfDay = timeSlotTable().querySelectorAll("input");

      expect(timesOfDay).toHaveLength(0);
    });

    it("sets radio button value to the index of the corresponding appointment", () => {
      const today = new Date();
      const availableTimeSlots = [
        { startsAt: today.setHours(9, 0, 0, 0) },
        { startsAt: today.setHours(9, 30, 0, 0) },
      ];
      render(
        <AppointmentForm
          availableTimeSlots={availableTimeSlots}
          today={today}
        />
      );

      expect(startsAtField(0).value).toEqual(
        availableTimeSlots[0].startsAt.toString()
      );
      expect(startsAtField(1).value).toEqual(
        availableTimeSlots[1].startsAt.toString()
      );
    });

    it("pre-selects the existing value", () => {
      const today = new Date();
      const timeSlot = today.setHours(9, 30, 0, 0);

      const availableTimeSlots = [
        { startsAt: today.setHours(9, 0, 0, 0) },
        { startsAt: today.setHours(9, 30, 0, 0) },
      ];

      render(
        <AppointmentForm
          availableTimeSlots={availableTimeSlots}
          today={today}
          startsAt={timeSlot}
        />
      );

      expect(startsAtField(1).checked).toEqual(true);
    });

    it("saves existing value when submitted", () => {
      expect.hasAssertions();

      const today = new Date();
      const timeSlot = today.setHours(9, 30, 0, 0);

      const availableTimeSlots = [
        { startsAt: today.setHours(9, 0, 0, 0) },
        { startsAt: timeSlot },
      ];

      render(
        <AppointmentForm
          availableTimeSlots={availableTimeSlots}
          today={today}
          startsAt={timeSlot}
          onSubmit={({ startsAt }) => expect(startsAt).toEqual(timeSlot)}
        />
      );

      act(() => {
        ReactTestUtils.Simulate.submit(form("appointment"));
      });
    });

    it("saves new value when submitted", () => {
      expect.hasAssertions();

      const today = new Date();

      const availableTimeSlots = [
        { startsAt: today.setHours(9, 0, 0, 0) },
        { startsAt: today.setHours(9, 30, 0, 0) },
      ];

      render(
        <AppointmentForm
          availableTimeSlots={availableTimeSlots}
          today={today}
          startsAt={availableTimeSlots[0].startsAt}
          onSubmit={({ startsAt }) => {
            expect(startsAt).toEqual(availableTimeSlots[1].startsAt);
          }}
        />
      );

      act(() => {
        ReactTestUtils.Simulate.change(startsAtField(1), {
          target: {
            value: availableTimeSlots[1].startsAt.toString(),
            name: "startsAt",
            checked: true,
          },
        });
      });

      expect(startsAtField(0).checked).toEqual(false);

      act(() => {
        ReactTestUtils.Simulate.submit(form("appointment"));
      });
    });
  });
});
