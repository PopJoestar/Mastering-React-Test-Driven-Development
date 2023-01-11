import React from "react";
import { Appointment, AppointmentsDayView } from "../src/AppointmentsDayView";
import {
  click,
  createContainer,
  element,
  elements,
  textOf,
  typesOf,
} from "./reactTestExtensions";

describe("Appointment", () => {
  let container, render;
  let customer = {};

  beforeEach(() => {
    ({ render, container } = createContainer());
  });

  const appointmentTable = () => element("#appointmentView > table");

  it("renders a table", () => {
    render(<Appointment customer={customer} />);
    expect(element("table")).not.toBeNull();
  });

  it("renders the customer first name", () => {
    customer = { firstName: "Ashley" };

    render(<Appointment customer={customer} />);

    expect(container).toContainText("Ashley");
  });

  it("renders another customer first name", () => {
    customer = { firstName: "Jordan" };

    render(<Appointment customer={customer} />);

    expect(container).toContainText("Jordan");
  });

  it("renders the customer lastName", () => {
    customer = { lastName: "Rakoto" };

    render(<Appointment customer={customer} />);
    expect(appointmentTable()).toContainText("Rakoto");
  });

  it("renders the salon service", () => {
    const service = "Cut";

    render(<Appointment customer={customer} service={service} />);

    expect(appointmentTable()).toContainText(service);
  });

  it("renders a heading with the time", () => {
    const today = new Date();
    const timestamp = today.setHours(9, 0, 0);

    render(<Appointment customer={customer} startsAt={timestamp} />);
    expect(element("h3")).not.toBeNull();
    expect(element("h3")).toContainText("Today's appointment at 09:00");
  });

  it("renders the appointments notes", () => {
    const notes = "caca";
    render(<Appointment customer={customer} notes={notes} />);
    expect(appointmentTable()).toContainText(notes);
  });

  it("renders the stylist name", () => {
    const stylist = "Bertrand";
    render(<Appointment customer={customer} stylist={stylist} />);
    expect(appointmentTable()).toContainText(stylist);
  });

  it("renders the customer phone number", () => {
    customer = { phoneNumber: "0123345" };
    render(<Appointment customer={customer} />);
    expect(appointmentTable()).toContainText(customer.phoneNumber);
  });
});

describe("AppointmentsDayView", () => {
  let container, render;

  const today = new Date();
  const appointments = [
    { startsAt: today.setHours(12, 0), customer: { firstName: "Ashley" } },
    { startsAt: today.setHours(13, 0), customer: { firstName: "Jordan" } },
  ];

  beforeEach(() => {
    ({ render, container } = createContainer());
  });

  const secondButton = () => elements("button")[1];

  it("renders a div with the right id", () => {
    render(<AppointmentsDayView appointments={[]} />);
    expect(element("div#AppointmentsDayView")).not.toBeNull();
  });

  it("renders multiple appointments in an ol element", () => {
    render(<AppointmentsDayView appointments={appointments} />);
    expect(element("ol")).not.toBeNull();
    expect(element("ol").children).toHaveLength(2);
  });

  it("renders each appointment in an li", () => {
    render(<AppointmentsDayView appointments={appointments} />);
    expect(textOf(elements("li"))).toEqual(["12:00", "13:00"]);
  });

  it("initially shows a message saying there are no appointments today", () => {
    render(<AppointmentsDayView appointments={[]} />);
    expect(container).toContainText(
      "There are no appointments scheduled for today."
    );
  });

  it("selects the first appointment by default", () => {
    render(<AppointmentsDayView appointments={appointments} />);
    expect(container).toContainText("Ashley");
  });

  it("has a button in each li", () => {
    render(<AppointmentsDayView appointments={appointments} />);
    expect(typesOf(elements("li > *"))).toEqual(["button", "button"]);
  });

  it("renders another appointment when selected", () => {
    render(<AppointmentsDayView appointments={appointments} />);
    click(secondButton());
    expect(container).toContainText("Jordan");
  });

  it("adds toggle class to button when selected", () => {
    render(<AppointmentsDayView appointments={appointments} />);
    click(secondButton());
    expect(secondButton()).toHaveClass("toggled");
  });
});
