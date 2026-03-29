import { CommonModule } from "@angular/common";
import { Component } from "@angular/core";
import { ActivatedRoute, RouterLink } from "@angular/router";

@Component({
  selector: "app-success-page",
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <main class="state-shell">
      <section class="state-card success">
        <p class="eyebrow">Payment Successful</p>
        <h1>Payment confirmed</h1>
        <p class="sub">
          Your KHQR payment for <strong>{{ productId }}</strong> completed successfully.
        </p>
        <a routerLink="/" class="primary-link">Back to shop</a>
      </section>
    </main>
  `,
})
export class SuccessPageComponent {
  readonly productId: string;

  constructor(route: ActivatedRoute) {
    this.productId = route.snapshot.queryParamMap.get("productId") || "order";
  }
}

