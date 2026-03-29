import { CommonModule } from "@angular/common";
import { Component, OnDestroy } from "@angular/core";
import { Router } from "@angular/router";

type Phase = "idle" | "ready" | "scanned";

type Product = {
  currency: "USD" | "KHR";
  desc: string;
  id: string;
  name: string;
  price: string;
};

@Component({
  selector: "app-shop-page",
  standalone: true,
  imports: [CommonModule],
  template: `
    <main class="shell">
      <header class="hero">
        <p class="eyebrow">Angular + Express demo</p>
        <h1>Angular KHQR Cafe Checkout</h1>
        <p class="sub">
          Angular handles the shop UI. Express owns the secure Koma routes.
        </p>
      </header>

      <section class="grid">
        <article *ngFor="let product of products" class="card">
          <div class="card-copy">
            <p class="eyebrow">Angular Demo</p>
            <h2>{{ product.name }}</h2>
            <p>{{ product.desc }}</p>
          </div>
          <div class="product-meta">
            <div class="product-price">\${{ product.price }}</div>
            <button
              class="pay-button"
              type="button"
              [disabled]="loadingId === product.id"
              (click)="openCheckout(product)"
            >
              {{ loadingId === product.id ? "Loading..." : "Pay with KHQR" }}
            </button>
          </div>
        </article>
      </section>

      <p *ngIf="error" class="error">{{ error }}</p>

      <div *ngIf="selected" class="overlay" (click)="onOverlayClick($event)">
        <section class="modal">
          <p class="eyebrow">KHQR Checkout</p>
          <h2>{{ selected.name }}</h2>
          <p class="amount">\${{ selected.price }} {{ selected.currency }}</p>

          <ng-container *ngIf="phase === 'ready' || phase === 'scanned'; else creatingState">
            <img class="qr" [src]="qrDataUrl" alt="KHQR code" />
            <p class="status">
              {{
                phase === "scanned"
                  ? "QR scanned. Waiting for payment confirmation..."
                  : "Scan this QR with your banking app."
              }}
            </p>
          </ng-container>

          <ng-template #creatingState>
            <p class="status">Creating QR session...</p>
          </ng-template>

          <div class="actions">
            <button class="secondary-button" type="button" (click)="cancelPayment()">
              Cancel payment
            </button>
            <button class="secondary-button" type="button" (click)="closeModal()">
              Close
            </button>
          </div>
        </section>
      </div>
    </main>
  `,
})
export class ShopPageComponent implements OnDestroy {
  readonly products: Product[] = [
    {
      id: "CAFE-01",
      name: "Latte Flight",
      desc: "Three signature milk coffees with tasting card",
      price: "12",
      currency: "USD",
    },
    {
      id: "PASTRY-01",
      name: "Pastry Box",
      desc: "Four cafe pastries packed for takeaway",
      price: "9",
      currency: "USD",
    },
  ];

  error = "";
  loadingId: string | null = null;
  md5 = "";
  phase: Phase = "idle";
  pollTimer: ReturnType<typeof setTimeout> | null = null;
  pollToken = "";
  qrDataUrl = "";
  selected: Product | null = null;

  constructor(private readonly router: Router) {}

  ngOnDestroy(): void {
    this.stopPolling();
  }

  async openCheckout(product: Product): Promise<void> {
    this.stopPolling();
    this.selected = product;
    this.loadingId = product.id;
    this.error = "";
    this.phase = "idle";

    try {
      const response = await fetch("/api/koma-qr", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount: product.price,
          currency: product.currency,
          productId: product.id,
        }),
      });
      const data = await response.json();

      if (!response.ok || data.error) {
        throw new Error(data.error || "Failed to create QR checkout");
      }

      this.qrDataUrl = data.qrDataUrl;
      this.md5 = data.md5;
      this.pollToken = data.pollToken;
      this.phase = "ready";
      this.pollTimer = setTimeout(() => void this.poll(), 800);
    } catch (error) {
      this.selected = null;
      this.error = error instanceof Error ? error.message : "Checkout failed";
    } finally {
      this.loadingId = null;
    }
  }

  closeModal(): void {
    this.stopPolling();
    this.selected = null;
    this.qrDataUrl = "";
    this.md5 = "";
    this.pollToken = "";
    this.phase = "idle";
  }

  cancelPayment(): void {
    const productId = this.selected?.id ?? "order";
    this.closeModal();
    void this.router.navigate(["/payment/cancelled"], { queryParams: { productId } });
  }

  onOverlayClick(event: MouseEvent): void {
    if (event.target === event.currentTarget) {
      this.closeModal();
    }
  }

  private async poll(): Promise<void> {
    if (!this.md5 || !this.pollToken || !this.selected) {
      return;
    }

    try {
      const response = await fetch("/api/koma-status", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ md5: this.md5, pollToken: this.pollToken }),
      });
      const data = await response.json();
      const bakong = data?.data ?? {};

      if (bakong.responseCode === 0) {
        const productId = this.selected.id;
        this.stopPolling();
        this.closeModal();
        void this.router.navigate(["/payment/success"], { queryParams: { productId } });
        return;
      }

      if (bakong.responseCode === 1 && bakong.errorCode === 2) {
        this.phase = "scanned";
        this.pollTimer = setTimeout(() => void this.poll(), 2500);
        return;
      }

      if (bakong.responseCode === 1 && bakong.errorCode === 3) {
        const productId = this.selected.id;
        this.stopPolling();
        this.closeModal();
        void this.router.navigate(["/payment/cancelled"], { queryParams: { productId } });
        return;
      }
    } catch {
      // Retry on transient network errors.
    }

    this.pollTimer = setTimeout(() => void this.poll(), 3000);
  }

  private stopPolling(): void {
    if (this.pollTimer !== null) {
      clearTimeout(this.pollTimer);
      this.pollTimer = null;
    }
  }
}

