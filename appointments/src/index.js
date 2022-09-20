import React from "react";
import { createRoot } from "react-dom/client";
import { AppointmentsDaysView } from "./Appointment";
import { sampleAppointments } from "./sampleData";

const container = document.getElementById("root");
const root = createRoot(container);

root.render(<AppointmentsDaysView appointments={sampleAppointments} />);
