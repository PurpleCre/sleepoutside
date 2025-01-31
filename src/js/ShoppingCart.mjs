import { qs, renderListWithTemplate, getLocalStorage, setLocalStorage } from "./utils.mjs";

//Template function for a single cart item
function cartItemTemplate(item) {
  // Fallback for missing color name
  const color = item.Colors?.[0]?.ColorName || "No color specified";

  return `
    <li class="cart-card divider">
      <button class="remove" data-id="${item.Id}">❌</button>
      <a href="#" class="cart-card__image">
        <img src="${item.Images.PrimarySmall}" alt="${item.Name}" />
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
      <form action="/checkout/index.html" method="post">
      <button type="submit">Checkout</button>
      </form>
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
    this.attachListeners();
  }

  attachListeners() {
    let checkoutBtn = document.getElementById("#checkout")
    let removeBtns = document.querySelectorAll(".remove");

    removeBtns.forEach((btn) => {
      btn.addEventListener("click", (e) => {
        // get product Id
        let id = e.target.dataset.id;
        // Get cart items from local storage
        const cartItems = getLocalStorage("so-cart");
        // remove target item
        let newCartItems = cartItems.filter((item) => item.Id !== id);
        // add new cart items to local storage
        if (newCartItems.length < 1) {
          localStorage.removeItem("so-cart");
        } else {
          setLocalStorage("so-cart", newCartItems);
        }
        // render cart contents
        window.location.reload();
      });
    });
    // Remove item from cart
    this.listElement.addEventListener("click", (event) => {
      if (event.target.classList.contains("remove")) {
        const id = parseInt(event.target.dataset.id);
        this.removeItem(id);
      }
    });
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
