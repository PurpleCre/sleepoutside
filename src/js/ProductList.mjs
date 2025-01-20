import { renderListWithTemplate } from "./utils.mjs";

function productCardTemplate(product) {
    return `<li class="product-card">
      <a href="product_pages/index.html?product=${product.Id}">
        <img src="${product.Image}" alt="Image of ${product.Name} ">
        <h3 class="card__brand">${product.Brand.Name}</h3>
        <h2 class="card__name">${product.Brand.Name}</h2>
        <p class="product-card__price">$${product.FinalPrice}</p>
      </a>
    </li>`;
}

export default class ProductListing {
    // We passed in this information to make our class as reusable as possible.
    // Being able to define these things when we use the class will make it very flexible
    constructor(category, dataSource, listElement) {
        this.category = category;
        this.dataSource = dataSource;
        this.listElement = listElement;
    }

    async init() {
        const list = await this.dataSource.getData()
        this.renderList(list);
    }

    renderList(list) {
        // 'list' is already an array, so slice it directly
        const firstFour = list.slice(0, 4);
        // Render only those four items
        renderListWithTemplate(productCardTemplate, this.listElement, firstFour);
    }

}