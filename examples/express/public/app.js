const overlay = document.getElementById("qr-overlay");
const closeButton = document.getElementById("close-modal");
const cancelButton = document.getElementById("cancel-payment");
const modalTitle = document.getElementById("modal-title");
const modalAmount = document.getElementById("modal-amount");
const modalStatus = document.getElementById("modal-status");
const qrImage = document.getElementById("qr-image");

let currentProduct = null;
let pollTimer = null;
let paymentDone = false;

function resetModal() {
  paymentDone = false;
  currentProduct = null;
  qrImage.src = "";
  qrImage.classList.add("hidden");
  modalTitle.textContent = "Loading payment";
  modalAmount.textContent = "Preparing checkout...";
  modalStatus.textContent = "Creating QR session...";
}

function stopPolling() {
  if (pollTimer) {
    clearTimeout(pollTimer);
    pollTimer = null;
  }
}

function closeModal() {
  stopPolling();
  overlay.classList.add("hidden");
  resetModal();
}

async function poll(md5, pollToken) {
  if (paymentDone) {
    return;
  }

  try {
    const response = await fetch("/api/koma-status", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ md5, pollToken }),
    });
    const data = await response.json();
    const bakong = data?.data ?? {};

    if (bakong.responseCode === 0) {
      paymentDone = true;
      stopPolling();
      modalStatus.textContent = "Payment confirmed. Redirecting...";
      window.location.href = `/payment/success?productId=${encodeURIComponent(currentProduct.id)}`;
      return;
    }

    if (bakong.responseCode === 1 && bakong.errorCode === 2) {
      modalStatus.textContent = "QR scanned. Waiting for payment confirmation...";
      pollTimer = setTimeout(() => poll(md5, pollToken), 2500);
      return;
    }

    if (bakong.responseCode === 1 && bakong.errorCode === 3) {
      paymentDone = true;
      stopPolling();
      modalStatus.textContent = "Payment failed. Redirecting...";
      window.location.href = `/payment/cancelled?productId=${encodeURIComponent(currentProduct.id)}`;
      return;
    }
  } catch {
    modalStatus.textContent = "Temporary polling error. Retrying...";
  }

  pollTimer = setTimeout(() => poll(md5, pollToken), 3000);
}

async function openCheckout(product) {
  stopPolling();
  paymentDone = false;
  currentProduct = product;
  overlay.classList.remove("hidden");
  modalTitle.textContent = product.name;
  modalAmount.textContent = `$${product.amount} ${product.currency}`;
  modalStatus.textContent = "Creating QR session...";
  qrImage.classList.add("hidden");

  try {
    const response = await fetch("/api/koma-qr", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        amount: product.amount,
        currency: product.currency,
        productId: product.id,
      }),
    });
    const data = await response.json();

    if (!response.ok || data.error) {
      throw new Error(data.error || "Failed to create KHQR checkout");
    }

    qrImage.src = data.qrDataUrl;
    qrImage.classList.remove("hidden");
    modalStatus.textContent = "Scan the KHQR code with your banking app.";
    pollTimer = setTimeout(() => poll(data.md5, data.pollToken), 800);
  } catch (error) {
    modalStatus.textContent = error instanceof Error ? error.message : "Checkout failed";
  }
}

document.querySelectorAll(".pay-button").forEach((button) => {
  button.addEventListener("click", () => {
    openCheckout({
      id: button.dataset.productId,
      name: button.dataset.productName,
      amount: button.dataset.amount,
      currency: button.dataset.currency,
    });
  });
});

overlay.addEventListener("click", (event) => {
  if (event.target === overlay) {
    closeModal();
  }
});

closeButton.addEventListener("click", closeModal);

cancelButton.addEventListener("click", () => {
  if (currentProduct) {
    window.location.href = `/payment/cancelled?productId=${encodeURIComponent(currentProduct.id)}`;
    return;
  }

  closeModal();
});
