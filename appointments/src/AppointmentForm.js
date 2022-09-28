import React, { useCallback, useState } from "react";

const timeIncrements = (numTimes, startTime, increment) =>
  Array(numTimes)
    .fill([startTime])
    .reduce((acc, _, i) => acc.concat([startTime + i * increment]));

const dailyTimeSlots = (salonOpensAt, salonClosesAt) => {
  const totalSlots = (salonClosesAt - salonOpensAt) * 2;
  const startTime = new Date().setHours(salonOpensAt, 0, 0, 0);
  const increment = 30 * 60 * 1000;
  return timeIncrements(totalSlots, startTime, increment);
};

const weeklyDateValues = (startDate) => {
  const midnight = new Date(startDate).setHours(0, 0, 0, 0);
  const increment = 24 * 60 * 60 * 1000;
  return timeIncrements(7, midnight, increment);
};

const toTimeValue = (timestamp) =>
  new Date(timestamp).toTimeString().substring(0, 5);

const toShortDate = (timestamp) => {
  const [day, , dayOfMonth] = new Date(timestamp).toDateString().split(" ");
  return `${day} ${dayOfMonth}`;
};

const mergeDateAndTime = (date, timeSlot) => {
  const time = new Date(timeSlot);
  return new Date(date).setHours(
    time.getHours(),
    time.getMinutes(),
    time.getSeconds(),
    time.getMilliseconds()
  );
};

const RadioButtonIfAvailable = ({
  availableTimeSlots,
  timeSlot,
  date,
  checkedTimeSlot,
  handleChange,
}) => {
  const startsAt = mergeDateAndTime(date, timeSlot);
  if (
    availableTimeSlots.some(
      (availableTimeSlot) => availableTimeSlot.startsAt === startsAt
    )
  ) {
    const isChecked = startsAt === checkedTimeSlot;

    return (
      <input
        name="startsAt"
        type="radio"
        value={startsAt}
        checked={isChecked}
        onChange={handleChange}
      />
    );
  }
  return null;
};

const TimeSlotTable = ({
  salonOpensAt,
  salonClosesAt,
  today,
  availableTimeSlots,
  checkedTimeSlot,
  handleChange,
}) => {
  const timeSlots = dailyTimeSlots(salonOpensAt, salonClosesAt);
  const dates = weeklyDateValues(today);

  return (
    <table id="time-slots">
      <thead>
        <tr>
          <th />
          {dates.map((date) => (
            <th key={date}>{toShortDate(date)}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {timeSlots.map((timeSlot) => (
          <tr key={timeSlot}>
            <th>{toTimeValue(timeSlot)}</th>
            {dates.map((date) => (
              <td key={date}>
                <RadioButtonIfAvailable
                  availableTimeSlots={availableTimeSlots}
                  date={date}
                  timeSlot={timeSlot}
                  checkedTimeSlot={checkedTimeSlot}
                  handleChange={handleChange}
                />
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export const AppointmentForm = ({
  selectableServices,
  selectableStylists,
  service,
  stylist,
  onSubmit,
  salonOpensAt,
  salonClosesAt,
  today,
  availableTimeSlots,
  startsAt,
  serviceStylist,
}) => {
  const [appointment, setAppointment] = useState({
    service,
    startsAt,
    stylist,
  });

  const handleChange = ({ target }) => {
    setAppointment((appointment) => ({
      ...appointment,
      [target.name]: target.value,
    }));
  };

  const handleStartsAtChange = useCallback(
    ({ target: { value } }) =>
      setAppointment((appointment) => ({
        ...appointment,
        startsAt: parseInt(value),
      })),
    []
  );

  const _selectableStylists =
    serviceStylist[appointment.service] ?? selectableStylists;

  const timeSlotsForStylist = appointment.stylist
    ? availableTimeSlots.filter((slot) =>
        slot.stylists.includes(appointment.stylist)
      )
    : availableTimeSlots;

  return (
    <form id="appointment" onSubmit={() => onSubmit(appointment)}>
      <label htmlFor="service">Service</label>
      <select
        name="service"
        value={service}
        id="service"
        onChange={handleChange}
      >
        <option />
        {selectableServices.map((s) => (
          <option key={s}>{s}</option>
        ))}
      </select>

      <label htmlFor="stylist">Stylist</label>
      <select
        name="stylist"
        value={stylist}
        id="stylist"
        onChange={handleChange}
      >
        <option />
        {_selectableStylists.map((s) => (
          <option key={s}>{s}</option>
        ))}
      </select>

      <TimeSlotTable
        salonOpensAt={salonOpensAt}
        salonClosesAt={salonClosesAt}
        today={today}
        availableTimeSlots={timeSlotsForStylist}
        checkedTimeSlot={appointment.startsAt}
        handleChange={handleStartsAtChange}
      />
      <input type={"submit"} value="Add" />
    </form>
  );
};

AppointmentForm.defaultProps = {
  selectableServices: [
    "Cut",
    "Blow-dry",
    "Cut & color",
    "Beard trim",
    "Cut & beard trim",
    "Extensions",
  ],
  salonOpensAt: 9,
  salonClosesAt: 19,
  today: new Date(),
  availableTimeSlots: [],
  selectableStylists: ["Bruce", "Dick", "Grayson", "Wayne"],
  serviceStylist: {
    Cut: ["Bruce", "Grayson"],
    Extensions: ["Wayne", "Dick"],
    "Beard trim": ["Bruce", "Dick", "Grayson", "Wayne"],
  },
};
