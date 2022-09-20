import React, { useState } from "react";

const appointmentTimeOfDay = (startsAt) => {
  const [h, m] = new Date(startsAt).toTimeString().split(":");
  return `${h}:${m}`;
};

export const Appointment = ({ customer }) => {
  return <div>{customer.firstName}</div>;
};

export const AppointmentsDaysView = ({ appointments }) => {
  const [selectedAppointment, setSelectedAppointment] = useState(0);

  return (
    <div id="appointmentsDaysView">
      <ol>
        {appointments.map((appointment, i) => (
          <li key={appointment.startsAt}>
            <button
              type="button"
              onClick={() => {
                setSelectedAppointment(i);
              }}
            >
              {appointmentTimeOfDay(appointment.startsAt)}
            </button>
          </li>
        ))}
      </ol>
      {appointments.length == 0 ? (
        <p>There are no appointments scheduled for today.</p>
      ) : (
        <Appointment customer={appointments[selectedAppointment].customer} />
      )}
    </div>
  );
};
