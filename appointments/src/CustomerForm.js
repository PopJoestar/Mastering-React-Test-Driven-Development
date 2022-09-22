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

  const handleChangeFirstName = ({ target }) =>
    setCustomer((customer) => ({
      ...customer,
      firstName: target.value,
    }));

  const handleChangeLastName = ({ target }) =>
    setCustomer((customer) => ({
      ...customer,
      lastName: target.value,
    }));

  const handleChangePhoneNumber = ({ target }) =>
    setCustomer((customer) => ({
      ...customer,
      phoneNumber: target.value,
    }));

  return (
    <form id="customer" onSubmit={() => onSubmit(customer)}>
      <label htmlFor="firstName">First name</label>
      <input
        type="text"
        name="firstName"
        value={firstName}
        id="firstName"
        onChange={handleChangeFirstName}
        readOnly
      />

      <label htmlFor="lastName">Last name</label>
      <input
        type="text"
        name="lastName"
        value={lastName}
        id="lastName"
        onChange={handleChangeLastName}
        readOnly
      />

      <label htmlFor="phoneNumber">Phone number</label>
      <input
        type="text"
        name="phoneNumber"
        value={phoneNumber}
        id="phoneNumber"
        onChange={handleChangePhoneNumber}
        readOnly
      />
    </form>
  );
};
