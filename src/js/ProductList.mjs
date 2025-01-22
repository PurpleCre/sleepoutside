function productCardTemplate(product) {
    return `<li class="product-card">
      <a href="product_pages/?product=${product.Id}">
        <img src="${product.Image}" alt="${product.Name}" />
        <h3 class="card__brand">${product.Brand.Name}</h3>
        <h2 class="card__name">${product.NameWithoutBrand}</h2>
        <p class="product-card__price">$${product.FinalPrice}</p>
      </a>
    </li>`;
  }
  
  export default class ProductList {
    constructor(category, dataSource, listElement) {
      this.category = category;
      this.dataSource = dataSource;
      this.listElement = listElement;
      this.allProducts = [];
    }
  
    async init() {
      const list = await this.dataSource.getData();
      this.allProducts = list;
      const filteredList = this.filterTents(list);
      this.renderList(filteredList);
      this.initSearch();
    }
  
    filterTents(list) {
      return list.filter(item => 
        ["880RR", "985RF", "985PR", "344YJ"].includes(item.Id)
      );
    }
  
    renderList(list) {
      this.listElement.innerHTML = list.map(productCardTemplate).join("");
    }
  
    initSearch() {
      const searchInput = document.getElementById("searchInput");
      searchInput.addEventListener("input", (e) => {
        const query = e.target.value.toLowerCase();
        if (!query.trim()) {
          this.renderList(this.filterTents(this.allProducts));
        } else {
          const searchResults = this.allProducts.filter(item => 
            item.Name.toLowerCase().includes(query.toLowerCase()) ||
            item.NameWithoutBrand.toLowerCase().includes(query.toLowerCase())
          );
          this.renderList(searchResults);
        }
      });
    }
  }