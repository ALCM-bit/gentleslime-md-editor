import * as api from "./index";

describe("@gentleslime/editor", () => {
  it("loads its entry point", () => {
    expect(api).toBeTypeOf("object");
  });
});
