import { qs, renderListWithTemplate, getLocalStorage } from "./utils.mjs";

//Template function for a single cart item
function cartItemTemplate(item) {
  // Fallback for missing color name
  const color = item.Colors?.[0]?.ColorName || "No color specified";

  return `
    <li class="cart-card divider">
      <a href="#" class="cart-card__image">
        <img src="${item.Image}" alt="${item.Name}" />
      </a>
      <a href="#">
        <h2 class="card__name">${item.Name}</h2>
      </a>
      <p class="cart-card__color">${color}</p>
      <p class="cart-card__quantity">qty: 1</p>
      <p class="cart-card__price">$${item.FinalPrice}</p>
    </li>`;
}

// Helper function to build the checkout HTML (subtotal, discount, etc.)
function cartTotalTemplate(items) {
  // if no items, just hide the checkout area
  if (!items || items.length === 0) {
    return "";
  }

  const total = items.reduce((sum, item) => sum + item.FinalPrice, 0);
  return `
    <label class="title">Checkout</label>
    <div class="details">
      <span>Your cart subtotal:</span>
      <span>$${total.toFixed(2)}</span>
      <span>Discount:</span>
      <span>N/a</span>
    </div>
    <div class="checkout-footer">
      <label class="price"><sup>$</sup>${total.toFixed(2)}</label>
      <button class="checkout-btn">Checkout</button>
    </div>`;
}

// Main ShoppingCart class
export default class ShoppingCart {

  constructor(key, listElementSelector, checkoutSelector) {
    this.key = key;
    this.listElement = qs(listElementSelector);
    this.checkoutElement = qs(checkoutSelector);
    this.cartItems = [];
  }

  // Called once on DOMContentLoaded (or whenever you want to initialize the cart)
  init() {
    this.cartItems = getLocalStorage(this.key) || []
    this.renderCartContents();
  }

  // Render all cart items and the checkout summary
  renderCartContents() {
    // Render cart items with a reusable list-rendering utility
    renderListWithTemplate(cartItemTemplate, this.listElement, this.cartItems);

    //Render checkout section (subtotal, discount, etc.)
    if (!this.cartItems.length) {
      // hide or clear the checkout area if no items
      this.checkoutElement.classList.add("hide");
      this.checkoutElement.innerHTML = "";
    } else {
      this.checkoutElement.classList.remove("hide");
      this.checkoutElement.innerHTML = cartTotalTemplate(this.cartItems);
    }
  }
}
