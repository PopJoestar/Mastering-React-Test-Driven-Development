import React from "react";
import { Appointment, AppointmentsDayView } from "../src/AppointmentsDayView";
import { click, createContainer } from "./reactTestExtensions";

describe("Appointment", () => {
  let container, render;
  let customer = {};

  beforeEach(() => {
    ({ render, container } = createContainer());
  });

  const appointmentTable = () =>
    container.querySelector("#appointmentView > table");

  it("renders a table", () => {
    render(<Appointment customer={customer} />);
    expect(container.querySelector("table")).not.toBeNull();
  });

  it("renders the customer first name", () => {
    customer = { firstName: "Ashley" };

    render(<Appointment customer={customer} />);

    expect(container.textContent).toMatch("Ashley");
  });

  it("renders another customer first name", () => {
    customer = { firstName: "Jordan" };

    render(<Appointment customer={customer} />);

    expect(container.textContent).toMatch("Jordan");
  });

  it("renders the customer lastName", () => {
    customer = { lastName: "Rakoto" };

    render(<Appointment customer={customer} />);

    expect(appointmentTable().textContent).toMatch("Rakoto");
  });

  it("renders the salon service", () => {
    const service = "Cut";

    render(<Appointment customer={customer} service={service} />);

    expect(expect(appointmentTable().textContent).toMatch(service));
  });

  it("renders a heading with the time", () => {
    const today = new Date();
    const timestamp = today.setHours(9, 0, 0);

    render(<Appointment customer={customer} startsAt={timestamp} />);
    expect(container.querySelector("h3")).not.toBeNull();
    expect(container.querySelector("h3").textContent).toEqual(
      "Today's appointment at 09:00"
    );
  });

  it("renders the appointments notes", () => {
    const notes = "caca";
    render(<Appointment customer={customer} notes={notes} />);
    expect(appointmentTable().textContent).toMatch(notes);
  });

  it("renders the stylist name", () => {
    const stylist = "Bertrand";
    render(<Appointment customer={customer} stylist={stylist} />);
    expect(appointmentTable().textContent).toMatch(stylist);
  });

  it("renders the customer phone number", () => {
    customer = { phoneNumber: "0123345" };
    render(<Appointment customer={customer} />);
    expect(appointmentTable().textContent).toMatch(customer.phoneNumber);
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

  it("renders a div with the right id", () => {
    render(<AppointmentsDayView appointments={[]} />);
    expect(container.querySelector("div#AppointmentsDayView")).not.toBeNull();
  });

  it("renders multiple appointments in an ol element", () => {
    render(<AppointmentsDayView appointments={appointments} />);
    expect(container.querySelector("ol")).not.toBeNull();
    expect(container.querySelector("ol").children).toHaveLength(2);
  });

  it("renders each appointment in an li", () => {
    render(<AppointmentsDayView appointments={appointments} />);
    expect(container.querySelectorAll("li")).toHaveLength(2);
    expect(container.querySelectorAll("li")[0].textContent).toEqual("12:00");
    expect(container.querySelectorAll("li")[1].textContent).toEqual("13:00");
  });

  it("initially shows a message saying there are no appointments today", () => {
    render(<AppointmentsDayView appointments={[]} />);
    expect(container.textContent).toMatch(
      "There are no appointments scheduled for today."
    );
  });

  it("selects the first appointment by default", () => {
    render(<AppointmentsDayView appointments={appointments} />);
    expect(container.textContent).toMatch("Ashley");
  });

  it("has a button in each li", () => {
    render(<AppointmentsDayView appointments={appointments} />);
    expect(container.querySelectorAll("li > button")).toHaveLength(2);
    expect(container.querySelectorAll("li > button")[0].type).toEqual("button");
  });

  it("renders another appointment when selected", () => {
    render(<AppointmentsDayView appointments={appointments} />);
    const button = container.querySelectorAll("button")[1];
    click(button);
    expect(container.textContent).toMatch("Jordan");
  });

  it("adds toggle class to button when selected", () => {
    render(<AppointmentsDayView appointments={appointments} />);
    const button = container.querySelectorAll("button")[1];
    click(button);
    expect(button.className).toMatch("toggled");
  });
});
