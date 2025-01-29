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
        const list = await this.dataSource.getData();
        this.fullList = list; // Store full dataset
        this.filteredList = this.filterList([...this.fullList]); // Ensure a fresh copy
        this.renderList(this.filteredList);

        // Add event listener for sorting
        document.getElementById("sort").addEventListener("change", (event) => {
            this.sortList(event.target.value);
        });
    }

    filterList(list, num = 4) {
        return list.slice(0, num);
    }

    sortList(criteria) {
        let sortedList = [...this.fullList]; // Always start fresh from full list

        if (criteria === "name") {
            sortedList.sort((a, b) => a.Name.localeCompare(b.Name));
        } else if (criteria === "price") {
            sortedList.sort((a, b) => a.FinalPrice - b.FinalPrice);
        }

        // Reapply the filtering after sorting
        this.filteredList = this.filterList(sortedList);
        this.renderList(this.filteredList);
    }

    renderList(list) {
        this.listEl.innerHTML = ""; // Clear previous content to prevent duplication
        renderListWithTemplate(productCardTemplate, this.listEl, list);
    }
}

