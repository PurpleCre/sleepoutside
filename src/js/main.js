import { loadHeaderFooter } from "./utils.mjs";
import ProductData from "./ProductData.mjs";
import ProductListing from "./ProductList.mjs";
import Alert from "./Alert.mjs";

loadHeaderFooter();

// alert logic
const mainEl = document.querySelector("main");
const alerts = new Alert(mainEl);
alerts.init();


const data = new ProductData("tents");
const prodEl = document.querySelector(".product-list");
const list = new ProductListing("tents", data, prodEl);

list.init();