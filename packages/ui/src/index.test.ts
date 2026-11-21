import * as api from "./index";

describe("@gentleslime/ui", () => {
  it("loads its entry point", () => {
    expect(api).toBeTypeOf("object");
  });
});
