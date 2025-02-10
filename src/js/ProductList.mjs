import { renderListWithTemplate } from "./utils.mjs";

function productCardTemplate(product) {
  let html = `<li class="product-card">
        <a href="../product_pages/index.html?product=${product.Id}">
        <img
            src="${product.Images.PrimaryMedium}"
            alt="Image of ${product.Name}"
        />
        <h3 class="card__brand">${product.Brand.Name}</h3>
        <h2 class="card__name">${product.Name}</h2>
        <p class="product-card__price">$${product.FinalPrice}</p>
    `;

  html += `</a>
        </li>
    `;

  return html;
}

export default class ProductList {
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
    try {
      const list = await this.dataSource.getData(this.category);
      if (!list) {
        throw new Error("No data received from server");
      }

      // filter the list to 4 items
      const filteredList = this.filterList(list);

      // render the list
      this.renderList(filteredList);

      // Add breadcrumbs
      this.handleBrandCrumbs(list);

      // Sort the products/list by price or name
      const sortElement = document.getElementById("sort");
      sortElement.addEventListener("change", (event) => {
        const sortedList = this.sortList(list, event.target.value);
        this.renderList(sortedList);
      });
    } catch (error) {
      console.error("Error in init:", error);
      if (this.listEl) {
        this.listEl.innerHTML = `<li class="error">Error loading products. Please try again later.</li>`;
      }
    }
  }

  filterList(list, num = 4) {
    return list.slice(0, num);
  }

  // render template lists
  renderList(list) {
    renderListWithTemplate(productCardTemplate, this.listEl, list);
  }

  // Add breadcrumbs to the page
  handleBrandCrumbs(list) {
    const breadcrumbsElement = document.querySelector("#breadcrumbs");
    breadcrumbsElement.innerHTML = `<span class="path">${this.category}</span> <span class="arrow">></span><span class="path">(${list.length} items)</span>`;
  }
}
