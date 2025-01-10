
//added the getLocalStorage function from  
import { getLocalStorage, setLocalStorage } from "./utils.mjs";
import ProductData from "./ProductData.mjs";

const dataSource = new ProductData("tents");
function addProductToCart(product) {
  //Get the existing items in the cart or start with an empty array
  let cartItems = getLocalStorage("so-cart")

  //Checking if cartItems is an arry. If not, force it into an array.
  if (!Array.isArray(cartItems)) {
    cartItems = [cartItems];
  }

  //add this new product to the array
  cartItems.push(product);
  //save updated array back to localStorage
  setLocalStorage("so-cart", cartItems);

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
