import { matcherHint, printExpected, printReceived } from "jest-matcher-utils";

export const toHaveClass = (received, expectedClass) => {
  const pass = received.className.includes(expectedClass);

  const sourceHint = () =>
    matcherHint("toHaveClass", "element", printExpected(expectedClass), {
      isNot: pass,
    });

  const actualTextHint = () =>
    "Actual text: " + printReceived(received.className);

  const message = () => [sourceHint(), actualTextHint()].join("\n\n");

  return { pass, message };
};
