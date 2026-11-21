import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.html',
  styles: `
    :host {
      display: grid;
      place-items: center;
      min-height: 100vh;
    }
  `,
})
export class App {
  // Product name is a brand, not a translatable UI string.
  protected readonly productName = 'GentleSlime';
}
