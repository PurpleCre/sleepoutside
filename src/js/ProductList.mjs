import { renderListWithTemplate } from "./utils.mjs";

function productCardTemplate(product) {
    let html =  `<li class="product-card">
        <a href="product_pages/index.html?product=${product.Id}">
        <img
            src="${product.Image}"
            alt="Image of ${product.Name}"
        />
        <h3 class="card__brand">${product.Brand.Name}</h3>
        <h2 class="card__name">${product.Name}</h2>
        <p class="product-card__price">$${product.FinalPrice}</p>
    `
    
    html += `</a>
        </li>
    `

    return html;
}

export default class ProductListing {
    constructor(category, dataSource, listEl) {
        this.category = category;
        this.dataSource = dataSource;
        this.listEl = listEl;
    }
    async init() {
        // our dataSource will return a Promise...so we can use await to resolve it.
        const list = await this.dataSource.getData();
        // filter the list to 4 items
        const filteredList = this.filterList(list)
        // render the list
        this.renderList(filteredList);
    }
    filterList(list, num = 4) {
        return list.slice(0, num);
        // return list.filter((product) => product.Image)
    }
    // render template lists
    renderList(list) {
        renderListWithTemplate(productCardTemplate, this.listEl, list);
    }
}