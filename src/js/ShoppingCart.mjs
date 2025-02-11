import { qs, renderListWithTemplate, getLocalStorage, setLocalStorage } from "./utils.mjs";

// Template function for a single cart item
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
      <p class="cart-card__quantity">qty: <strong>${item.quantity}</strong></p>
      <p class="cart-card__price">$${item.FinalPrice}</p>
    </li>`;
}

// Template function for a single wishlist item
function wishlistItemTemplate(item) {
  // Use a fallback if the color isn’t specified
  const color = item.Colors?.[0]?.ColorName || "No color specified";
  return `
    <li class="wishlist-card divider">
      <button class="remove-wishlist" data-id="${item.Id}">❌</button>
        <img src="${item.Images.PrimarySmall}" alt="${item.Name}" />
        <h2 class="card__name">${item.Name}</h2>
      <p class="wishlist-card__color">${color}</p>
      <button class="move-to-cart" data-id="${item.Id}">Move to Cart</button>
    </li>
  `;
}

// Helper function to build the checkout HTML (subtotal, discount, etc.)
function cartTotalTemplate(items) {
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
    this.cartItems = getLocalStorage(this.key) || [];
    this.renderCartContents();
    this.attachListeners();
    this.renderWishlistContents();
    this.attachWishlistListeners();
  }

  removeItem(id) {
    // Ensure type consistency by converting item.Id to a number during comparison.
    this.cartItems = this.cartItems.filter(item => parseInt(item.Id, 10) !== id);
    setLocalStorage("so-cart", this.cartItems);
    this.renderCartContents();
  }

  attachListeners() {
    // Attach event listeners for remove buttons on cart items
    this.listElement.addEventListener("click", (event) => {
      // Use closest() to ensure we always get the button element.
      const removeBtn = event.target.closest(".remove");
      if (!removeBtn) return; // Exit if the clicked element isn't a remove button.

      // Convert the data-id attribute to a number.
      const id = parseInt(removeBtn.dataset.id, 10);
      if (isNaN(id)) {
        console.error("Invalid product id for removal:", removeBtn.dataset.id);
        return;
      }

      // Remove the item from the cart.
      this.removeItem(id);
      window.location.reload();
    });
  }

  attachWishlistListeners() {
    // Attach event listeners for wishlist actions: moving an item to the cart or removing it
    const wishlistElement = qs(".wishlist");
    if (!wishlistElement) {
      console.error("No wish container found - check your HTML for an element with class 'wishlist'.")
      return;
    }

    wishlistElement.addEventListener("click", (event) => {
      const button = event.target.closest("button");
      if (!button) return;

      const id = parseInt(button.dataset.id, 10);
      if (isNaN(id)) {
        console.error("Invalid product id:", button.dataset.id);
        return;
      }

      if (button.classList.contains("move-to-cart")) {
        let wishlist = getLocalStorage("so-wishlist") || [];
        let product = wishlist.find(item => parseInt(item.Id, 10) === id);
        if (product) {
          // Remove from wishlist
          wishlist = wishlist.filter(item => parseInt(item.Id, 10) !== id);
          setLocalStorage("so-wishlist", wishlist);

          // Add product to cart:
          let cartItems = getLocalStorage("so-cart") || [];
          let existingCartItem = cartItems.find(item => parseInt(item.Id, 10) === id);
          if (existingCartItem) {
            existingCartItem.quantity = (existingCartItem.quantity || 1) + 1;
          } else {
            product.quantity = 1;
            cartItems.push(product);
          }
          setLocalStorage("so-cart", cartItems);
          window.location.reload();
        }
      } else if (button.classList.contains("remove-wishlist")) {
        // Remove item from wishlist:
        let wishlist = getLocalStorage("so-wishlist") || [];
        wishlist = wishlist.filter(item => parseInt(item.Id, 10) !== id);
        setLocalStorage("so-wishlist", wishlist);
        window.location.reload();
      }
    });
  }

  // Render all cart items and the checkout summary
  renderCartContents() {
    renderListWithTemplate(cartItemTemplate, this.listElement, this.cartItems);
    if (!this.cartItems.length) {
      this.checkoutElement.classList.add("hide");
      this.checkoutElement.innerHTML = "";
    } else {
      this.checkoutElement.classList.remove("hide");
      this.checkoutElement.innerHTML = cartTotalTemplate(this.cartItems);
    }
  }

  // Render wishlist items from localStorage
  renderWishlistContents() {
    const wishlistElement = qs(".wishlist");
    const wishlistItems = getLocalStorage("so-wishlist") || [];
    wishlistElement.innerHTML = ""; // Clear previous content
    renderListWithTemplate(wishlistItemTemplate, wishlistElement, wishlistItems);
  }
}
