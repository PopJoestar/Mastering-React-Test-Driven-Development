import React from "react";
import { createRoot } from "react-dom/client";
import { AppointmentForm } from "./AppointmentForm";
import { AppointmentsDayView } from "./AppointmentsDayView";
import { CustomerForm } from "./CustomerForm";
import { sampleAppointments, sampleAvailableTimeSlots } from "./sampleData";

const container = document.getElementById("root");
const root = createRoot(container);

// root.render(<AppointmentsDayView appointments={sampleAppointments} />);
root.render(<CustomerForm />);
// root.render(<AppointmentForm availableTimeSlots={sampleAvailableTimeSlots} />);
