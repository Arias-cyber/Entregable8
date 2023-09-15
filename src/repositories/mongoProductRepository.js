import ProductManager from "../dao/mongo/manager/products.js";
import ProductRepository from "./Products.repository.js";

class MongoProductRepository extends ProductRepository {
  constructor() {
    super();
    this.productManager = new ProductManager();
  }

  async getAll(filter, options) {
    return this.productManager.getProducts(filter, options);
  }

  async getById(id) {
    return this.productManager.getProduct(id);
  }

  async create(productData) {
    return this.productManager.createProduct(productData);
  }

  async update(id, productData) {
    return this.productManager.updateProduct(id, productData);
  }

  async delete(id) {
    return this.productManager.deleteProduct(id);
  }
  async getProductsCount(filter) {
    return this.productManager.getProductsCount(filter);
  }
}

export default MongoProductRepository;