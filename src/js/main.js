import ProductData from "./ProductData.mjs";
import ProductListing from "./ProductList.mjs";
// import { loadHeaderFooter } from "./utils.mjs";
// import Alert from "./Alert.mjs";

// dynamically load header and footer
// loadHeaderFooter();

// alert logic
// const mainEl = document.querySelector("main");
// const alerts = new Alert(mainEl);
// alerts.init();

const data = new ProductData("tents");
const element = document.querySelector(".product-list");
const list = new ProductListing("tents", data, element);

list.init();