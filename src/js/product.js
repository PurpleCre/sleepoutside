import { setLocalStorage, getLocalStorage } from "./utils.mjs";
import ProductData from "./ProductData.mjs";

const dataSource = new ProductData("tents");

function addProductToCart(product) {
  // create variable to store cart products
  let products = [];
  // retrieve other cart items if available or create products array
  getLocalStorage("so-cart")
    ? (products = getLocalStorage("so-cart"))
    : (products = []);
  // push product to cart
  products.push(product);
  // add products array to ocal storage
  setLocalStorage("so-cart", products);
}
// add to cart button event handler
async function addToCartHandler(e) {
  const product = await dataSource.findProductById(e.target.dataset.id);
  addProductToCart(product);
}

// add listener to Add to Cart button
document
  .getElementById("addToCart")
  .addEventListener("click", addToCartHandler);
