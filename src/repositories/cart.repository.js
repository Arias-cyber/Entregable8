class CartRepository {
  async getById(id) {
    throw new Error("Method not implemented");
  }

  async create(cartData) {
    throw new Error("Method not implemented");
  }

  async addProductToCart(cartId, productId, quantity) {
    throw new Error("Method not implemented");
  }

  async deleteProductFromCart(cartId, productId) {
    throw new Error("Method not implemented");
  }

  async update(cartId, cartData) {
    throw new Error("Method not implemented");
  }

  async updateProductInCart(cartId, productId, quantity) {
    throw new Error("Method not implemented");
  }

  async delete(cartId) {
    throw new Error("Method not implemented");
  }
}
  
  export default CartRepository;