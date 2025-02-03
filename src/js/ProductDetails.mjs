import { getLocalStorage, setLocalStorage, setSuperscript } from "./utils.mjs";

export default class ProductDetails {
  constructor(productId, dataSource) {
    this.productId = productId;
    this.product = {};
    this.dataSource = dataSource;
  }
  async init() {
    // use our datasource to get the details for the current product. findProductById will return a promise! use await or .then() to process it
    this.product = await this.dataSource.findProductById(this.productId)
    // once we have the product details we can render out the HTML
    this.renderProductDetails(this.product)
    // once the HTML is rendered we can add a listener to Add to Cart button
    // Notice the .bind(this). Our callback will not work if we don't include that line. Review the readings from this week on 'this' to understand why.
    document.getElementById("addToCart")
      .addEventListener("click", this.addToCart.bind(this));
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

  // Generate HTML display
  renderProductDetails(product) {
    let newProd = "";

    // if (product.FinalPrice < product.SuggestedRetailPrice) {
    //   const discount = product.SuggestedRetailPrice - product.FinalPrice;
    //   newProd += `<p class="product-card__discount">Enjoy a $${discount.toFixed(2)} discount!!!!</p>`
    // }

    newProd += `<h3>${product.Brand.Name}</h3>
        <h2 class="divider">${product.NameWithoutBrand}</h2>
        <img
          class="divider"
          src="${product.Images.PrimaryLarge}"
          alt="${product.NameWithoutBrand}"
        />
        <p class="product-card__price">${product.ListPrice}</p>
        <p class="product__color">${product.Colors[0].ColorName}</p>
        <p class="product__description">
        ${product.DescriptionHtmlSimple}
        </p>
        <div class="product-detail__add">
          <button id="addToCart" data-id="${product.Id}">Add to Cart</button>
        </div>`;

    document.querySelector(".product-detail").innerHTML = newProd;
  }
}