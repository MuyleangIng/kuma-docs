import { Routes } from "@angular/router";

import { CancelledPageComponent } from "./pages/cancelled-page.component";
import { ShopPageComponent } from "./pages/shop-page.component";
import { SuccessPageComponent } from "./pages/success-page.component";

export const routes: Routes = [
  { path: "", component: ShopPageComponent },
  { path: "payment/success", component: SuccessPageComponent },
  { path: "payment/cancelled", component: CancelledPageComponent },
  { path: "**", redirectTo: "" },
];

