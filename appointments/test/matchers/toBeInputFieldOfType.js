import { matcherHint, printExpected } from "jest-matcher-utils";

export const toBeInputFieldOfType = (received, type) => {
  const pass = received?.type === type && received.tagName === "INPUT";

  const sourceHint = () =>
    matcherHint("toBeInputFieldOfType", "element", printExpected(type), {
      isNot: pass,
    });

  const receivedText = () => {
    if (received == null) {
      return "element cannot be null";
    }
    if (received?.tagName !== "INPUT") {
      return `<${received?.tagName.toLowerCase()}>`;
    }

    return `<input type=${received.type}>`;
  };

  const actualHint = () => `Actual: ${receivedText()}`;

  const message = () => [sourceHint(), actualHint()].join("\n\n");

  return { pass, message };
};
