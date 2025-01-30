import { renderListWithTemplate } from "./utils.mjs";

function productCardTemplate(product) {
    let html =  `<li class="product-card">
        <a href="../product_pages/index.html?product=${product.Id}">
        <img
            src="${product.Images.PrimaryMedium}"
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

    // Sort the products/list by price or name
    sortList(list, criteria) {
    if (criteria === "name") {
      return list.sort((a, b) => a.Name.localeCompare(b.Name));
    } else if (criteria === "price") {
      return list.sort((a, b) => a.FinalPrice - b.FinalPrice);
    }
    return list;
  }
    async init() {
        // our dataSource will return a Promise...so we can use await to resolve it.
        const list = await this.dataSource.getData(this.category);
        // filter the list to 4 items
        const filteredList = this.filterList(list)
        // render the list
        this.renderList(filteredList); 

        // Sort the products/list by price or name
        const sortElement = document.getElementById("sort");
        sortElement.addEventListener("change", (event) => {
            const sortedList = this.sortList(list, event.target.value);
            this.renderList(sortedList);
        });
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