import { getParams } from './utils.mjs';
import ProductData from "./ProductData.mjs";
import ProductDetails from "./ProductDetails.mjs";

const dataSource = new ProductData("tents");
const productId = getParams('product');
const product = new ProductDetails(productId, dataSource);
product.init();


// function addProductToCart(product) {
//   let cart = getLocalStorage("so-cart") || [];
//   if (!Array.isArray(cart)) {
//     cart = [cart];
//   }

//   cart.push(product);
//   setLocalStorage("so-cart", cart);
//   alert("Product added to cart:", product);
// }

// // add to cart button event handler
// async function addToCartHandler(e) {
//   const product = await dataSource.findProductById(e.target.dataset.id);
//   addProductToCart(product);
// }

// document
//   .getElementById("addToCart")
//   .addEventListener("click", addToCartHandler);



