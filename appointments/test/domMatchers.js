import { toContainText } from "./matchers/toContainText";
import { toHaveClass } from "./matchers/toHaveClass";
import { toBeInputFieldOfType } from "./matchers/toBeInputFieldOfType";

expect.extend({ toContainText });

expect.extend({ toHaveClass });

expect.extend({ toBeInputFieldOfType });
