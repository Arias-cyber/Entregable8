import CartManager from "../dao/mongo/manager/carts.js";
import CartRepository from "./cart.repository.js"

class MongoCartRepository extends CartRepository {
  constructor() {
    super();
    this.cartManager = new CartManager();
  }

  async getById(id) {
    return this.cartManager.getCart(id);
  }

  async create(cartData) {
    return this.cartManager.createCart(cartData);
  }

  async addProductToCart(cartId, productId, quantity) {
    return this.cartManager.addProductToCart(cartId, productId, quantity);
  }

  async deleteProductFromCart(cartId, productId) {
    return this.cartManager.deleteProductFromCart(cartId, productId);
  }

  async update(cartId, cartData) {
    return this.cartManager.updateCart(cartId, cartData);
  }

  async updateProductInCart(cartId, productId, quantity) {
    return this.cartManager.updateProductInCart(cartId, productId, quantity);
  }

  async delete(cartId) {
    return this.cartManager.deleteCart(cartId);
  }
  async deletePurchasedProducts(cartId, productsToPurchase) {
    return this.cartManager.deletePurchasedProducts(cartId, productsToPurchase);
  }
  async cleanCart(cartId) {
    return this.cartManager.cleanCart(cartId);
  }

}

export default MongoCartRepository;