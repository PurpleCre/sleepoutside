import { setLocalStorage, getLocalStorage } from "./utils.mjs";
import ProductData from "./ProductData.mjs";

const dataSource = new ProductData("tents");

function addProductToCart(product) {
  // Retrieve existing cart items from Local Storage
  let cart = getLocalStorage("so-cart");

  // If the cart is not an array (e.g., a single object), convert it to an array
  if (!Array.isArray(cart)) {
    cart = cart ? [cart] : [];
  }

  // Add the new product to the cart
  cart.push(product);

  // Save the updated cart back to Local Storage
  setLocalStorage("so-cart", cart);
}
// Add to cart button event handler
async function addToCartHandler(e) {
  const product = await dataSource.findProductById(e.target.dataset.id);
  addProductToCart(product);
}

// Add listener to Add to Cart button
document
  .getElementById("addToCart")
  .addEventListener("click", addToCartHandler);
