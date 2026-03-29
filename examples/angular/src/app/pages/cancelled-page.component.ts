import { CommonModule } from "@angular/common";
import { Component } from "@angular/core";
import { ActivatedRoute, RouterLink } from "@angular/router";

@Component({
  selector: "app-cancelled-page",
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <main class="state-shell">
      <section class="state-card cancelled">
        <p class="eyebrow">Payment Cancelled</p>
        <h1>Payment was not completed</h1>
        <p class="sub">
          The KHQR flow for <strong>{{ productId }}</strong> was cancelled or did not finish.
        </p>
        <a routerLink="/" class="primary-link">Try again</a>
      </section>
    </main>
  `,
})
export class CancelledPageComponent {
  readonly productId: string;

  constructor(route: ActivatedRoute) {
    this.productId = route.snapshot.queryParamMap.get("productId") || "order";
  }
}
