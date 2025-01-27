import { loadHeaderFooter } from "./utils.mjs";
import ProductData from "./ProductData.mjs";
import ProductListing from "./ProductList.mjs";

loadHeaderFooter();

const data = new ProductData("tents");
const prodEl = document.querySelector(".product-list");
const list = new ProductListing("tents", data, prodEl);

list.init();

// rebase

