import { toHaveClass } from "./toHaveClass";

const stripTerminalColor = (text) => text.replace(/\x1B\[\d+m/g, "");

describe("toHaveClass matcher", () => {
  it("returns pass is true when class is found in the given DOM element", () => {
    const domElement = {
      className: "class",
    };

    const result = toHaveClass(domElement, "class");

    expect(result.pass).toBe(true);
  });

  it("returns pass is false when the class is not found in the given DOM element", () => {
    const domElement = {
      className: "",
    };

    const result = toHaveClass(domElement, "class");

    expect(result.pass).toBe(false);
  });

  it("returns a message that contains the source line if no match", () => {
    const domElement = {
      className: "",
    };

    const result = toHaveClass(domElement, "class to find");

    expect(stripTerminalColor(result.message())).toContain(
      `expect(element).toHaveClass("class to find")`
    );
  });

  it("returns a message that contains the source line if negated match", () => {
    const domElement = {
      className: "class to find",
    };

    const result = toHaveClass(domElement, "class to find");

    expect(stripTerminalColor(result.message())).toContain(
      `expect(element).not.toHaveClass("class to find")`
    );
  });

  it("returns a message that contains the actual class name", () => {
    const domElement = {
      className: "class to find",
    };

    const result = toHaveClass(domElement, "class to find");

    expect(stripTerminalColor(result.message())).toContain(
      `Actual text: "class to find"`
    );
  });
});
