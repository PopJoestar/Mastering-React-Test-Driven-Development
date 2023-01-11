import { stripTerminalColor } from "./helpers";
import { toBeInputFieldOfType } from "./toBeInputFieldOfType";

describe("toBeInputFieldOfType matcher", () => {
  const elementFrom = (text) => {
    const parent = document.createElement("div");
    parent.innerHTML = text;
    return parent.firstChild;
  };

  it("returns pass is true when input element of the right type is found", () => {
    const domElement = elementFrom("<input type=text />");
    const result = toBeInputFieldOfType(domElement, "text");
    expect(result.pass).toBe(true);
  });

  it("returns pass is false when input element is the wrong type", () => {
    const domElement = elementFrom("<input type=text />");
    const result = toBeInputFieldOfType(domElement, "date");
    expect(result.pass).toBe(false);
  });

  it("returns pass is false when element is null", () => {
    const result = toBeInputFieldOfType(null, "text");
    expect(result.pass).toBe(false);
  });

  it("returns pass is true when the element is the right tag", () => {
    const domElement = elementFrom("<input />");
    const result = toBeInputFieldOfType(domElement, "text");
    expect(result.pass).toBe(true);
  });

  it("returns a message that contains the source line if no match", () => {
    const domElement = elementFrom("<input type=text />");
    const result = toBeInputFieldOfType(domElement, "date");
    expect(stripTerminalColor(result.message())).toMatch(
      `expect(element).toBeInputFieldOfType("date")`
    );
  });

  it("returns a message that contains the source line if negated match", () => {
    const domElement = elementFrom("<input type=text />");
    const result = toBeInputFieldOfType(domElement, "text");

    expect(stripTerminalColor(result.message())).toMatch(
      `expect(element).not.toBeInputFieldOfType("text")`
    );
  });

  it("returns a specific message when element is null", () => {
    const result = toBeInputFieldOfType(null, "text");

    expect(stripTerminalColor(result.message())).toMatch(
      `Actual: element cannot be null`
    );
  });

  it("returns a message that contains the actual tag when the element has the wrong tag", () => {
    const domElement = elementFrom("<p />");
    const result = toBeInputFieldOfType(domElement, "text");

    expect(stripTerminalColor(result.message())).toMatch("Actual: <p>");
  });

  it("returns a message that contains the actual tag when the element has the wrong type", () => {
    const domElement = elementFrom('<input type="text" />');
    const result = toBeInputFieldOfType(domElement, "date");

    expect(stripTerminalColor(result.message())).toMatch(
      "Actual: <input type=text>"
    );
  });
});
