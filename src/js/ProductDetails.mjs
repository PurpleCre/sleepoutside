import { getLocalStorage, setLocalStorage, setSuperscript } from "./utils.mjs";

export default class ProductDetails {
  constructor(productId, dataSource) {
    this.productId = productId;
    this.product = {};
    this.dataSource = dataSource;
  }
  async init() {
    // Retrieve product details and render HTML
    this.product = await this.dataSource.findProductById(this.productId);
    this.renderProductDetails(this.product);

    // Attach listeners for both buttons
    document.getElementById("addToCart")
      .addEventListener("click", this.addToCart.bind(this));
    document.getElementById("addToWishlist")
      .addEventListener("click", this.addToWishlist.bind(this));
  }
  addToCart() {
    // Retrieve the cart from local storage or initialize an empty array
    let products = getLocalStorage("so-cart") || [];

    // Check if the product already exists in the cart
    let existingProduct = products.find(item => item.Id === this.product.Id);

    if (existingProduct) {
      // If product exists, increment its quantity
      existingProduct.quantity = (existingProduct.quantity || 1) + 1;
    } else {
      // If product does not exist, add it with a quantity of 1
      this.product.quantity = 1;
      products.push(this.product);
    }

    // Save updated cart back to local storage
    setLocalStorage("so-cart", products);

    // Notify user
    alert(`${this.product.NameWithoutBrand} added to cart`);

    setSuperscript();
  }

  addToWishlist() {
    let wishlist = getLocalStorage("so-wishlist") || [];

    // Check if the product is already in the wishlist
    let existing = wishlist.find(item => item.Id === this.product.Id);
    if (existing) {
      alert("This item is already in your wishlist.");
      return;
    }
    // Optionally, you can include quantity or other properties
    this.product.quantity = 1;
    wishlist.push(this.product);
    setLocalStorage("so-wishlist", wishlist);
    alert(`${this.product.NameWithoutBrand} added to wishlist`);
  }

  // Add breadcrumbs to the page
  handleBrandCrumbs() {
    const breadcrumbsElement = document.querySelector("#breadcrumbs");
    breadcrumbsElement.innerHTML = `<span class="c">${this.product.Category}</span>`
  }

  // Generate HTML display
  renderProductDetails(product) {
    let newProd = ""
    if (product.FinalPrice < product.SuggestedRetailPrice) {
      const discount = product.SuggestedRetailPrice - product.FinalPrice;
      newProd += `<p class="product-card__discount">Enjoy a $${discount.toFixed(2)} discount!!!!</p>`
    }

    newProd += `
    <h3>${product.Brand.Name}</h3>
    <h2 class="divider">${product.NameWithoutBrand}</h2>
    <picture class="divider">
      <source media="(max-width: 500px)" srcset="${product.Images.PrimaryMedium}" />
      <img src="${product.Images.PrimaryLarge}" alt="${product.NameWithoutBrand}" />
    </picture>
    <p class="product-card__price">${product.ListPrice}</p>
    <p class="product__color">${product.Colors[0].ColorName}</p>
    <p class="product__description">
      ${product.DescriptionHtmlSimple}
    </p>
    <div class="product-detail__actions">
      <button id="addToCart" data-id="${product.Id}">Add to Cart</button>
      <button id="addToWishlist" data-id="${product.Id}">Add to Wishlist</button>
    </div>
  `;

    document.querySelector(".product-detail").innerHTML = newProd;
  }
}


