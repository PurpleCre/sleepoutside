import { loadHeaderFooter } from "./utils.mjs";
import ShoppingCart from "./ShoppingCart.mjs";

//Load the site header and footer
loadHeaderFooter();

//Create a new cart instance and initialize it
const cart = new ShoppingCart("so-cart", ".product-list", "#cart-checkout");
cart.init();