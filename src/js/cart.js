import { getLocalStorage } from "./utils.mjs";

const cartItems = getLocalStorage("so-cart");
const htmlItems = cartItems.map((item) => cartItemTemplate(item));
const htmlTotal = cartItemTotalTemplate();
const divCheckout = document.getElementById("cart-checkout");

function renderCartContents() {
  document.querySelector(".product-list").innerHTML = htmlItems.join("");
  divCheckout.innerHTML = htmlTotal;
}

function cartItemTemplate(item) {
  const newItem = `<li class="cart-card divider">
  <a href="#" class="cart-card__image">
    <img
      src="${item.Image}"
      alt="${item.Name}"
    />
  </a>
  <a href="#">
    <h2 class="card__name">${item.Name}</h2>
  </a>
  <p class="cart-card__color">${item.Colors[0].ColorName}</p>
  <p class="cart-card__quantity">qty: 1</p>
  <p class="cart-card__price">$${item.FinalPrice}</p>
</li>`;

  return newItem;
}

function addTotalCart() {
  if (!cartItems || cartItems.length === 0) return divCheckout.classList.add("hide");
  const total = cartItems.reduce((sum, item) => sum + item.FinalPrice, 0);
  return total;
}

function cartItemTotalTemplate() {
  const total = addTotalCart();
  return `<label class="title">Checkout</label>
    <div class="details">
      <span>Your cart subtotal:</span>
      <span>$${total}</span>
      <span>Discount:</span>
      <span>N/a</span>
    </div>
    <div class="checkout-footer">
      <label class="price"><sup>$</sup>${total}</label>
      <button class="checkout-btn">Checkout</button>
    </div>
  </div>`
}

addTotalCart()

renderCartContents();
