class Product {
  constructor(title, image, desc, price) {
    this.title = title;
    this.imageUrl = image;
    this.description = desc;
    this.price = price;
  }
}

class ElementAttribute {
  constructor(attrName, attrValue) {
    this.name = attrName;
    this.value = attrValue;
  }
}

class Components {
  constructor(renderHookId, shouldrender = true) {
    this.hookId = renderHookId;
    //Approach to solve the problem of rendering items earlier than the parent
    if (shouldrender) {
      this.render();
    }
  }

  createRootElement(tag, cssClasses, attributes) {
    const rootElement = document.createElement(tag);
    if (cssClasses) {
      rootElement.className = cssClasses;
    }
    if (attributes && attributes.length > 0) {
      for (const attr of attributes) {
        rootElement.setAttribute(attr.name, attr.value);
      }
    }
    document.getElementById(this.hookId).append(rootElement);
    return rootElement;
  }
}

class ShoppingCart extends Components {
  items = [];

  //Using getters and setters to update the cart total

  set cartItems(value) {
    this.items = value;
    this.totalOutput.innerHTML = `<h2>Total: \$${this.totalAmount.toFixed(
      2
    )}</h2>`;
  }

  get totalAmount() {
    const sum = this.items.reduce(
      (prevValue, curItem) => prevValue + curItem.price,
      0
    );
    return sum;
  }

  constructor(renderHookId) {
    super(renderHookId, false);
    this.orderProducts = () => {
      console.log('Ordering...');
      console.log(this.items);
    };
    this.render();
  }

  addProduct(product) {
    const updatedItems = [...this.items];
    updatedItems.push(product);
    this.cartItems = updatedItems;
  }

  render() {
    const cartEl = this.createRootElement('section', 'cart');
    cartEl.innerHTML = `
    <h2>Total: \$${0}</h2>
    <button>Order Now!</button>
    `;
    const orderButton = cartEl.querySelector('button');
    orderButton.addEventListener('click', this.orderProducts); //Alternative instead of using bind()
    this.totalOutput = cartEl.querySelector('h2');
  }
}

//Rendering one element
class ProductItem extends Components {
  constructor(product, renderHookId) {
    super(renderHookId, false);
    this.product = product;
    this.render();
  }

  addToCart() {
    App.addProductToCart(this.product); //refering to the product stored into this class
  }

  render() {
    const prodEl = this.createRootElement('li', 'product-item');

    prodEl.innerHTML = `
    <div>
    <img src="${this.product.imageUrl}" alt="${this.product.title}">
    </div>
    <div class="product-item__content">
    <h2>${this.product.title}</h2>
    <h3>\$${this.product.price}</h3>
    <p>${this.product.description}</p>
    <button>Add to Cart</button>
    </div>
    `;
    const addCartButton = prodEl.querySelector('button');
    addCartButton.addEventListener('click', this.addToCart.bind(this));
  }
}

class ProductList extends Components {
  products = [];
  constructor(renderHookId) {
    super(renderHookId);
    this.fetchProducts();
  }
  fetchProducts() {
    this.products = [
      new Product(
        'A pillow',
        'https://m.media-amazon.com/images/I/71oz-uGuMhS._AC_UF894,1000_QL80_.jpg',
        'A soft pillow',
        18.99
      ),
      new Product(
        'A Carpet',
        'https://contentgrid.homedepot-static.com/hdus/en_US/DTCCOMNEW/Articles/types-of-rugs-2022-section-4.jpg',
        'A carpet that you may like, or not!',
        98.99
      ),
    ];
    this.renderProducts();
  }

  renderProducts() {
    for (const prod of this.products) {
      new ProductItem(prod, 'prod-list');
    }
  }

  render() {
    this.createRootElement('ul', 'productList', [
      new ElementAttribute('id', 'prod-list'),
    ]);
    if (this.product && this.product.length > 0) {
      this.renderProducts();
    }
  }
}

class Shop extends Components {
  constructor() {
    super();
  }

  render() {
    this.cart = new ShoppingCart('app');
    new ProductList('app');
  }
}

class App {
  static cart;

  //Using static methods
  static init() {
    const shop = new Shop();
    this.cart = shop.cart; //Refering to the cart at Shop class
  }
  static addProductToCart(product) {
    this.cart.addProduct(product);
  }
}

App.init();
