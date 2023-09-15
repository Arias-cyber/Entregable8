import { readFileSync, writeFileSync } from 'fs';
import ProductManager from "./ProductManager.js";
const productManager = new ProductManager();

export default class CartManager {
    constructor() {
        this.carts = []
        this.path = './carts.json'
        this.loadCarts();
    }
    loadCarts() {
        try {
            const data = readFileSync(this.path, 'utf-8');
            this.carts = JSON.parse(data);
        } catch (error) {
            this.carts = [];
        }
    }
    saveCarts() {
        try {
            writeFileSync(this.path, JSON.stringify(this.carts));
        } catch (error) {
            console.error('Error al guardar el carrito:', error);
        }
    }
    addCart() {
        const cart = {
            id: this.carts.length + 1,
            products: [],
        }
            this.carts.push(cart);
            this.saveCarts();
            return 'Carrito creado exitosamente';
        };
    getCartById(id) {
        const cart = this.carts.find((cart) => cart.id === id);
        if (cart) {
          return cart
        } else {
          return null;
        }
      }
    addProductInCart(cartId, productId, quantity=1) {
        const cartIndex = this.carts.findIndex(cart => cart.id === cartId);
        if (cartIndex !== -1) {
            const product = productManager.getProductById(productId);
            if (!product) {
              return 'El producto no existe';
            }
            const productIndex = this.carts[cartIndex].products.findIndex(product => product.product === productId);
            if (productIndex !== -1) {
                // Si el producto ya existe en el carrito, se suma la cantidad
                this.carts[cartIndex].products[productIndex].quantity += quantity;
            } else {
                // Si el producto no existe en el carrito, se agrega como un nuevo elemento
                const productInCart = {
                    product: productId,
                    quantity: quantity
                };
                this.carts[cartIndex].products.push(productInCart);
            }
            this.saveCarts();
            return 'Producto agregado al carrito exitosamente';
        } else {
            return 'Carrito no encontrado';
        }
    }
}