import { ChangeDetectionStrategy, Component } from "@angular/core";

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styles: `
    :host {
      display: grid;
      place-items: center;
      min-height: 100vh;
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent {
  // Product name is a brand, not a translatable UI string.
  protected readonly productName = "GentleSlime";
}
