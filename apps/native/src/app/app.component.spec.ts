import { TestBed } from "@angular/core/testing";
import { AppComponent } from "./app.component";

describe("AppComponent", () => {
  it("renders the product name", async () => {
    const fixture = TestBed.createComponent(AppComponent);
    await fixture.whenStable();
    const heading = (fixture.nativeElement as HTMLElement).querySelector("h1");
    expect(heading?.textContent).toContain("GentleSlime");
  });
});
