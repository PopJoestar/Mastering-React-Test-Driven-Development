import React from "react";

export const CustomerForm = ({ firstName }) => {
  return (
    <form id="customer">
      <label htmlFor="firstName">First name</label>
      <input
        type="text"
        name="firstName"
        value={firstName}
        id="firstName"
        readOnly
      />
    </form>
  );
};
