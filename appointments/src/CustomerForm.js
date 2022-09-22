import React, { useState } from "react";

export const CustomerForm = ({
  firstName,
  onSubmit,
  lastName,
  phoneNumber,
}) => {
  const [customer, setCustomer] = useState({
    firstName,
    lastName,
    phoneNumber,
  });

  const handleChange = ({ target }) =>
    setCustomer((customer) => ({
      ...customer,
      [target.name]: target.value,
    }));

  return (
    <form id="customer" onSubmit={() => onSubmit(customer)}>
      <label htmlFor="firstName">First name</label>
      <input
        type="text"
        name="firstName"
        value={firstName}
        id="firstName"
        onChange={handleChange}
        readOnly
      />

      <label htmlFor="lastName">Last name</label>
      <input
        type="text"
        name="lastName"
        value={lastName}
        id="lastName"
        onChange={handleChange}
        readOnly
      />

      <label htmlFor="phoneNumber">Phone number</label>
      <input
        type="text"
        name="phoneNumber"
        value={phoneNumber}
        id="phoneNumber"
        onChange={handleChange}
        readOnly
      />
      <input type={"submit"} value="Add" />
    </form>
  );
};
